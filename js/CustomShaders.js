var passShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture; ",
		"varying vec2 vUv;",

		"void main() {",
		"    gl_FragColor = texture2D(texture, vUv);",
		"}"
	
	].join("\n")
	
}

var colorShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
				
		"uniform sampler2D texture;",
		"varying vec2 vUv;",

		"vec3 rainbow(float h) {",
		"  h = mod(mod(h, 1.0) + 1.0, 1.0);",
		"  float h6 = h * 6.0;",
		"  float r = clamp(h6 - 4.0, 0.0, 1.0) +",
		"    clamp(2.0 - h6, 0.0, 1.0);",
		"  float g = h6 < 2.0",
		"    ? clamp(h6, 0.0, 1.0)",
		"    : clamp(4.0 - h6, 0.0, 1.0);",
		"  float b = h6 < 4.0",
		"    ? clamp(h6 - 2.0, 0.0, 1.0)",
		"    : clamp(6.0 - h6, 0.0, 1.0);",
		"  return vec3(r, g, b);",
		"}",

		"vec3 rgb2hsv(vec3 c)",
		"{",
		"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
		"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
		"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
		"    ",
		"    float d = q.x - min(q.w, q.y);",
		"    float e = 1.0e-10;",
		"    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
		"}",

		"vec3 hsv2rgb(vec3 c)",
		"{",
		"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
		"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
		"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
		"}",


		"void main(){",

		"  vec4 tex0 = texture2D(texture, vUv);",
		"  vec3 hsv = rgb2hsv(tex0.rgb);",

		"  hsv.r += 0.01;",
		"  hsv.r = mod(hsv.r, 1.0);",
		"  hsv.g *= 1.00001;",
		"  // hsv.g = mod(hsv.g, 1.0);",
		"  vec3 rgb = hsv2rgb(hsv); ",

		"  gl_FragColor = vec4(rgb,1.0);",
		"}"
	
	].join("\n")
	
}

var flowShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform vec2 resolution;",
		"uniform float time;",
		"uniform sampler2D texture;",
		"varying vec2 vUv;",
		"uniform vec2 mouse;",

		"void main( void ){",
		"    vec2 uv = vUv;",

		"    vec2 e = 1.0/resolution.xy;",


		"    float am1 = 0.5 + 0.5*0.927180409;",
		"    float am2 = 10.0;",

		"    for( int i=0; i<20; i++ ){",
		"    	float h  = dot( texture2D(texture, uv*0.99,               -100.0).xyz, vec3(0.333) );",
		"    	float h1 = dot( texture2D(texture, uv+vec2(e.x,mouse.x), -100.0).xyz, vec3(0.333) );",
		"    	float h2 = dot( texture2D(texture, uv+vec2(mouse.y,e.y), -100.0).xyz, vec3(0.333) );",
		"    	vec2 g = 0.001*vec2( (h1-h), (h2-h) )/e;",
		"    	vec2 f = g.yx*vec2(3.0*mouse.x, 3.0*mouse.y);",

		"   	g = mix( g, f, am1 );",

		"    	uv += 0.00005*g*am2;",
		"    }",

		"    vec3 col = texture2D(texture, uv).xyz;",
		"    gl_FragColor = vec4(col, 1.0);",
		"}"
	
	].join("\n")
	
}

var blurShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }
		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",

		"void main() {",
		"  float step_w = 1.0/resolution.x;",
		"  float step_h = 1.0/resolution.y;",
		"  vec2 tc = vUv;",
		"  vec4 input0 = texture2D(texture,tc);",
		"   ",
		"  vec2 x1 = vec2(step_w, 0.0);",
		"  vec2 y1 = vec2(0.0, step_h);",
		"    ",
		"  input0 += texture2D(texture, tc+x1); // right",
		"  input0 += texture2D(texture, tc-x1); // left",
		"  input0 += texture2D(texture, tc+y1); // top",
		"  input0 += texture2D(texture, tc-y1); // bottom",

		"  input0 *=0.2;",

		"  gl_FragColor = input0;",
		"}"
	
	].join("\n")
	
}
var sharpenShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }
		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture;",
		"uniform vec2 resolution;",
		"varying vec2 vUv;",

		"float kernel[9];",
		"vec2 offset[9];",

		"void main() {",
		"	float step_w = 1.0/resolution.x;",
		"	float step_h = 1.0/resolution.y;",
		"	vec2 tc = vUv;",
		"	vec4 input0 = texture2D(texture,tc);",
		"	kernel[0] = -1.0; kernel[1] = -1.0; kernel[2] = -1.0;",
		"	kernel[3] = -1.0; kernel[4] = 8.0; kernel[5] = -1.0;",
		"	kernel[6] = -1.0; kernel[7] = -1.0; kernel[8] = -1.0;",
		"	offset[0] = vec2(-step_w, -step_h);",
		"	offset[1] = vec2(0.0, -step_h);",
		"	offset[2] = vec2(step_w, -step_h);",
		"	offset[3] = vec2(-step_w, 0.0);",
		"	offset[4] = vec2(0.0, 0.0);",
		"	offset[5] = vec2(step_w, 0.0);",
		"	offset[6] = vec2(-step_w, step_h);",
		"	offset[7] = vec2(0.0, step_h);",
		"	offset[8] = vec2(step_w, step_h);",
		"	input0 += texture2D(texture, tc + offset[0]) * kernel[0];",
		"	input0 += texture2D(texture, tc + offset[1]) * kernel[1];",
		"	input0 += texture2D(texture, tc + offset[2]) * kernel[2];",
		"	input0 += texture2D(texture, tc + offset[3]) * kernel[3];",
		"	input0 += texture2D(texture, tc + offset[4]) * kernel[4];",
		"	input0 += texture2D(texture, tc + offset[5]) * kernel[5];",
		"	input0 += texture2D(texture, tc + offset[6]) * kernel[6];",
		"	input0 += texture2D(texture, tc + offset[7]) * kernel[7];",
		"	input0 += texture2D(texture, tc + offset[8]) * kernel[8];",
		"	float kernelWeight = kernel[0] + kernel[2] + kernel[3] + kernel[4] + kernel[5] + kernel[6] + kernel[7] + kernel[8];",
		"	if (kernelWeight <= 0.0) {",
		"	   kernelWeight = 1.0;",
		"	}",
		"	gl_FragColor = vec4((input0/kernelWeight).rgb, 1.0);",
		"}"
	
	].join("\n")
	
}


var diffShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null },
			"texture2"  : { type: "t", value: null },
			"texture3"  : { type: "t", value: null }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture;",
		"uniform sampler2D texture2;",
		"uniform sampler2D texture3;",
		"varying vec2 vUv;",

		"void main() {",
		"  vec4 tex0 = texture2D(texture, vUv);",
		"  vec4 tex1 = texture2D(texture2, vUv);",
		"  vec4 tex2 = texture2D(texture3, vUv);",

		"  vec4 fc = (tex2 - tex1);",
		"  vec4 add = (fc + tex0);",
		"  gl_FragColor = vec4(fc);",
		"}"
	
	].join("\n")
	
}
var reposShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		

		"varying vec2 vUv;",
		"uniform sampler2D texture;",
		"uniform vec2 mouse;",
		"void main(){",

		"    vec2 tc = vUv;",
		"    vec4 look = texture2D(texture,tc);",
		// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*0.001;",
		"    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/50.0, mouse.y/50.0);",
		"    vec2 coord = offs+tc;",
		"    vec4 repos = texture2D(texture, coord);",
		// "    repos*=1.5;",
		"    gl_FragColor = repos;",
		"} "
	
	].join("\n")
	
}


var alphaShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture; ",
		"varying vec2 vUv;",

        "void main() {",
      
        // "    float avg = dot(texture2D(texture, vUv).r, 1.0)/3.0;",
        "    if(texture2D(texture, vUv).r > 0.5){",
        "      gl_FragColor = vec4(texture2D(texture, vUv).rgb, texture2D(texture, vUv).a);",
        "    }",
        "    else {",
        "      discard;",
        // "      gl_FragColor = vec4(texture2D(texture, vUv).rgb, avg);",
        "    }",
        "    ",
		"}"
	].join("\n")
	
}



