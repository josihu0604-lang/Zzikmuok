export default {
  async headers(){
    return [{ source:'/api/:path*',
      headers:[
        {key:'Access-Control-Allow-Credentials', value:'true'},
        {key:'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL || '*'},
        {key:'Access-Control-Allow-Methods', value:'GET,DELETE,PATCH,POST,PUT,OPTIONS'},
        {key:'Access-Control-Allow-Headers', value:'Content-Type, Authorization, X-Requested-With'}
      ]}];
  }
};
