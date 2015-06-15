

var alphaShader2 = {
    
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
        "    if(texture2D(texture, vUv).r > 0.1){",
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