var container;
var scene, renderer, camera, controls;
var fbScene, fbRenderer, fbCamera, fbTexture, fbShaders, fbMaterial;
var mouseX = 0, mouseY = 0;
var time = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var start = Date.now(); 
var gradient, tex;
var meshes = [];
var obj;
var counter = 0;
var rtt;

init();
animate();

function init() {
        
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
    camera.position.set(0,0, 10);

    camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
    camera2.position.set(0,40, 10);

    rtt = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    rtt.minFilter = rtt.magFilter = THREE.NearestFilter;

    // controls = new THREE.OrbitControls(camera);
    
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer: true, antialias: true} );
    renderer.setClearColor(0xffffff, 1.0)
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.physicallyBasedShading = true;
    
    container = document.getElementById( 'container' );
    // container.appendChild( renderer.domElement );
    // for(var j = 0; j< 3; j++){
        for(var i = 0; i < 5; i++){
            var gMesh = new GradientMesh(scene, window.innerWidth, window.innerHeight);
            gMesh.init(i);
            // gMesh.mesh.position.z = -i*0.00001;
            // gMesh.mesh.position.x = j*100;
            meshes.push(gMesh);
        }

        for(var i = 0; i < 5; i++){
            var gMesh = new GradientMesh(scene, window.innerWidth, window.innerHeight);
            gMesh.init(i);
            gMesh.mesh.position.y = 40;
            // gMesh.mesh.position.x = j*100;
            meshes.push(gMesh);
        }
    // }


    // document.addEventListener( 'keydown', function(){screenshot(renderer)}, false );
    
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    var effectHBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    var effectVBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
    effectHBlur.uniforms[ 'h' ].value = 0.5 / ( window.innerWidth /2 );
    effectVBlur.uniforms[ 'v' ].value = 0.5 / ( window.innerHeight /2 );
    effectVBlur.renderToScreen = true;

    composer.addPass( effectHBlur );
    composer.addPass( effectVBlur );
    camera.rotation.set(Math.PI/100, Math.PI/100, 0);

    composer2 = new THREE.EffectComposer( renderer, rtt );
    composer2.addPass( new THREE.RenderPass( scene, camera2 ) );
    composer2.addPass( effectHBlur );
    composer2.addPass( effectVBlur );

    fbInit();

}
function animate(){
    window.requestAnimationFrame(animate);
    draw();
}
function draw(){
    // camera.setLens(10)
    time+=0.01;
    // rtt.needsUpdate = true;
    // for(var j = 0; j<4; j++){
        // for(var k = 0; k<4; k++){
            for(var i = 0; i < meshes.length; i++){
                meshes[i].update();
                // meshes[i].mesh.position.z = -i*0.0000001;
                meshes[i].mesh.position.z = -i*0.001;
                // meshes[i].mesh.rotation.y = Date.now()*0.000000000001;
                // meshes[i].mesh.rotation.y = Date.now()*0.0001;
            }
        // }
    // }
    // renderer.render(scene, camera2, rtt);
    // renderer.render(scene, camera);

    composer2.render();
    composer.render();


    fbDraw();
}
function fbInit(){
    fbScene = new THREE.Scene();
    fbCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    fbCamera.position.set(0,0,0);

    fbCamera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
    fbCamera2.position.z = 750;

    controls = new THREE.OrbitControls(fbCamera2);


    fbRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true});
    fbRenderer.setClearColor(0xffffff);
    fbRenderer.setSize(window.innerWidth, window.innerHeight);
    
    container.appendChild(fbRenderer.domElement);

    fbScene = new THREE.Scene();
    

    canv = document.createElement("CANVAS");
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    ctx = canv.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
    ctx.drawImage(renderer.domElement,0,0, window.innerWidth, window.innerHeight);
    fbTexture = new THREE.Texture(canv);
    fbTexture2 = THREE.ImageUtils.loadTexture("tex/2.jpg");
    // var clone = rtt.clone();
    // fbTexture2 = THREE;

    var customShaders = new CustomShaders();
    var customShaders2 = new CustomShaders();

    fbShaders = [ 
        // customShaders.blurShader, 
        // customShaders.reposShader, 
        // customShaders.diffShader, 
        // customShaders.colorShader, 
        // customShaders.sharpenShader,
        // customShaders.alphaShader
        customShaders.blurShader, 
        customShaders.reposShader, 
        customShaders.diffShader, 
        customShaders.passThroughShader, 
        customShaders.sharpenShader,
        customShaders.alphaShader
    ];

    fbShaders2 = [
        customShaders2.blurShader, 
        customShaders2.reposShader, 
        customShaders2.diffShader, 
        customShaders2.reposShader, 
        customShaders2.sharpenShader,
        customShaders2.alphaShader
    ];

    fbMaterial = new FeedbackMaterial(fbRenderer, fbScene, fbCamera, fbTexture, fbShaders);
    fbMaterial2 = new FeedbackMaterial(fbRenderer, fbScene, fbCamera, fbTexture2, fbShaders2);
        
    fbMaterial.init();
    fbMaterial2.init();

    fbMaterial2.mesh.position.z = 100;
    // fbMaterial2.mesh.geometry = new THREE.SphereGeometry(500,100,100);
    // fbMaterial2.mesh.rotation.x = Math.PI/4;
    // fbMaterial2.mesh.rotation.y = Math.PI/4;
    // fbMaterial2.mesh.rotation.x = Math.PI/4;


    document.addEventListener( 'keydown', function(){screenshot(fbRenderer)}, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    // document.addEventListener( 'mousedown', onDocumentMouseDown, false );

}
function onDocumentMouseMove( event ) {
    unMappedMouseX = (event.clientX );
    unMappedMouseY = (event.clientY );
    mouseX = map(unMappedMouseX, window.innerWidth, -1.0,1.0);
    mouseY = map(unMappedMouseY, window.innerHeight, -1.0,1.0);
    
    
    for(var i = 0; i < fbMaterial.fbos.length; i++){
      fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);
      fbMaterial2.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(-mouseX, -mouseY);
    }
    
}
function onDocumentMouseDown( event ) {
    for(var i = 0; i < meshes.length; i++){
        // meshes[i].update();
        if(counter%2 == 0){
            meshes[i].mesh.visible = false;
        } else {
            meshes[i].mesh.visible = true;
        }
    }
    counter++;
}
function fbDraw(){
    
    ctx.fillStyle = "green";
    ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
    ctx.drawImage(renderer.domElement, 0, 0, window.innerWidth, window.innerHeight);

    // fbMaterial2.fbo1.material.uniforms["texture"].value = rtt.clone();

    fbTexture.needsUpdate = true;
    fbTexture2.needsUpdate = true;
        
    fbMaterial.update();
    fbMaterial2.update();

    fbRenderer.render(fbScene, fbCamera2);

    fbMaterial.getNewFrame();
    fbMaterial2.getNewFrame();

    fbMaterial.swapBuffers();
    fbMaterial2.swapBuffers();
    
}