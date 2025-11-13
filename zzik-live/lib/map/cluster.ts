import Supercluster from 'supercluster';

export type Point = {
  id: string;
  lat: number;
  lng: number;
  cover?: string;
  isNew?: boolean;
  name?: string;
  category?: string;
};

export type ClusterPoint = {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: Point & {
    cluster?: boolean;
    point_count?: number;
    point_count_abbreviated?: string;
  };
};

export function buildCluster(points: Point[], radius = 60, maxZoom = 18) {
  const index = new Supercluster<Point>({
    radius,
    maxZoom,
    minPoints: 2,
  });

  const features: ClusterPoint[] = points.map((p) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [p.lng, p.lat],
    },
    properties: p,
  }));

  index.load(features);
  return index;
}

export function getClustersInBounds(
  index: Supercluster<Point>,
  bbox: [number, number, number, number],
  zoom: number
) {
  return index.getClusters(bbox, Math.floor(zoom));
}

export function getClusterExpansionZoom(
  index: Supercluster<Point>,
  clusterId: number
) {
  return index.getClusterExpansionZoom(clusterId);
}

export function getClusterLeaves(
  index: Supercluster<Point>,
  clusterId: number,
  limit = 10
) {
  return index.getLeaves(clusterId, limit);
}
