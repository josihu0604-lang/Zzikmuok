/**
 * ZZIK Claude Agent - Tool Definitions and Implementations
 * 
 * Tools:
 * 1. search_places - 장소 검색
 * 2. save_bookmark - 북마크 저장
 */

import { z } from "zod";
import type { Messages } from "@anthropic-ai/sdk/resources";

export type ToolUseBlock = Extract<
  NonNullable<Messages.Message["content"]>[number],
  { type: "tool_use" }
>;

/**
 * Tool Schemas for Claude API
 */
export const toolSchemas = [
  {
    name: "search_places",
    description:
      "지도 뷰포트 또는 키워드 기준으로 근처 촬영 스팟을 검색합니다. 사용자의 현재 위치 주변에서 인기 있는 장소를 찾을 때 사용합니다.",
    input_schema: {
      type: "object",
      properties: {
        q: {
          type: "string",
          description: "검색 키워드 (예: 카페, 공원, 야경). 없으면 빈 문자열"
        },
        lat: {
          type: "number",
          description: "중심 위도 (예: 37.5665)"
        },
        lng: {
          type: "number",
          description: "중심 경도 (예: 126.9780)"
        },
        radius_m: {
          type: "number",
          description: "검색 반경(미터). 기본값 1500. 최대 5000"
        },
        limit: {
          type: "integer",
          description: "최대 결과 개수. 기본값 10. 최대 50"
        }
      },
      required: ["lat", "lng"]
    }
  },
  {
    name: "save_bookmark",
    description:
      "장소를 사용자의 북마크에 저장합니다. 나중에 다시 방문하고 싶은 장소를 기록할 때 사용합니다.",
    input_schema: {
      type: "object",
      properties: {
        place_id: {
          type: "string",
          description: "장소 고유 ID (search_places 결과의 id 값)"
        },
        note: {
          type: "string",
          description: "사용자 메모 (선택사항)"
        }
      },
      required: ["place_id"]
    }
  }
] as const;

/**
 * In-memory storage for demo
 * 실제 서비스에서는 데이터베이스로 교체
 */
const inMemoryBookmarks = new Map<string, Array<{ place_id: string; note?: string; saved_at: string }>>();

/**
 * Demo place data
 * 실제 서비스에서는 Supabase/PostGIS 또는 지도 API로 교체
 */
const demoPlaces = [
  {
    id: "plc_seongsu_cafe_01",
    name: "성수 카페거리",
    lat: 37.5447,
    lng: 127.0557,
    tags: ["카페", "핫플레이스", "인스타"],
    description: "감성 카페가 모여있는 성수동 대표 촬영 스팟",
    last_post_at: "2025-11-12T14:30:00Z",
    popularity: 0.95,
    image_url: "/images/placeholder-cafe.svg"
  },
  {
    id: "plc_hangang_park",
    name: "한강공원 뚝섬",
    lat: 37.5304,
    lng: 127.0661,
    tags: ["공원", "야경", "피크닉"],
    description: "낮에는 피크닉, 밤에는 야경 촬영이 좋은 장소",
    last_post_at: "2025-11-12T11:20:00Z",
    popularity: 0.88,
    image_url: "/images/placeholder-restaurant.svg"
  },
  {
    id: "plc_forest_01",
    name: "서울숲",
    lat: 37.5443,
    lng: 127.0374,
    tags: ["공원", "자연", "산책"],
    description: "계절마다 다른 풍경을 담을 수 있는 도심 속 숲",
    last_post_at: "2025-11-11T16:45:00Z",
    popularity: 0.92,
    image_url: "/images/placeholder-dessert.svg"
  },
  {
    id: "plc_gangnam_street",
    name: "강남역 거리",
    lat: 37.4979,
    lng: 127.0276,
    tags: ["쇼핑", "스트릿", "야경"],
    description: "활기찬 도심 분위기와 네온사인 촬영에 적합",
    last_post_at: "2025-11-12T19:00:00Z",
    popularity: 0.87,
    image_url: "/images/placeholder-french.svg"
  },
  {
    id: "plc_hongdae_01",
    name: "홍대 앞 거리",
    lat: 37.5563,
    lng: 126.9236,
    tags: ["스트릿", "공연", "버스킹"],
    description: "젊음의 거리, 거리 공연과 다양한 문화 체험",
    last_post_at: "2025-11-12T17:30:00Z",
    popularity: 0.91,
    image_url: "/images/placeholder-cafe.svg"
  }
];

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Execute tool and return result
 * 
 * @param block - Tool use block from Claude
 * @param userId - User identifier for bookmarks
 */
export async function runTool(block: ToolUseBlock, userId = "demo-user") {
  const { name, input } = block;

  try {
    // search_places implementation
    if (name === "search_places") {
      const schema = z.object({
        q: z.string().optional().default(""),
        lat: z.number(),
        lng: z.number(),
        radius_m: z.number().optional().default(1500).refine(val => val <= 5000, {
          message: "반경은 최대 5000m입니다"
        }),
        limit: z.number().int().optional().default(10).refine(val => val <= 50, {
          message: "최대 50개까지 검색 가능합니다"
        }),
      });

      const args = schema.parse(input);

      // Filter places by distance
      const placesWithDistance = demoPlaces.map(place => ({
        ...place,
        distance: calculateDistance(args.lat, args.lng, place.lat, place.lng)
      }));

      // Filter by radius and keyword
      let filtered = placesWithDistance.filter(p => p.distance <= args.radius_m);
      
      if (args.q) {
        const query = args.q.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query)
        );
      }

      // Sort by distance
      filtered.sort((a, b) => a.distance - b.distance);

      // Apply limit
      const results = filtered.slice(0, args.limit).map(p => ({
        id: p.id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        distance_m: Math.round(p.distance),
        distance_km: (p.distance / 1000).toFixed(1),
        tags: p.tags,
        description: p.description,
        popularity: p.popularity,
        last_post_at: p.last_post_at,
        image_url: p.image_url
      }));

      return {
        success: true,
        query: args.q,
        center: { lat: args.lat, lng: args.lng },
        radius_m: args.radius_m,
        items: results,
        total: results.length,
        message: results.length > 0 
          ? `${results.length}개의 장소를 찾았습니다.`
          : "검색 조건에 맞는 장소가 없습니다."
      };
    }

    // save_bookmark implementation
    if (name === "save_bookmark") {
      const schema = z.object({
        place_id: z.string().min(1, "place_id는 필수입니다"),
        note: z.string().optional()
      });

      const args = schema.parse(input);

      // Check if place exists
      const placeExists = demoPlaces.some(p => p.id === args.place_id);
      if (!placeExists) {
        return {
          success: false,
          error: "존재하지 않는 장소 ID입니다."
        };
      }

      // Save bookmark
      const userBookmarks = inMemoryBookmarks.get(userId) ?? [];
      
      // Check if already bookmarked
      const alreadyBookmarked = userBookmarks.some(b => b.place_id === args.place_id);
      if (alreadyBookmarked) {
        return {
          success: false,
          message: "이미 북마크된 장소입니다.",
          total_bookmarks: userBookmarks.length
        };
      }

      userBookmarks.push({
        place_id: args.place_id,
        note: args.note,
        saved_at: new Date().toISOString()
      });
      
      inMemoryBookmarks.set(userId, userBookmarks);

      const place = demoPlaces.find(p => p.id === args.place_id);

      return {
        success: true,
        place_id: args.place_id,
        place_name: place?.name,
        note: args.note,
        total_bookmarks: userBookmarks.length,
        message: `'${place?.name}'을(를) 북마크에 저장했습니다.`
      };
    }

    // Unknown tool
    return {
      success: false,
      error: `알 수 없는 도구: ${name}`
    };

  } catch (error) {
    console.error(`Tool execution error (${name}):`, error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "입력 값이 올바르지 않습니다.",
        details: error.issues
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "도구 실행 중 오류가 발생했습니다."
    };
  }
}
