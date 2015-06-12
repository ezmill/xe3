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

init();
animate();

function init() {
        
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
    // camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.01, 100000);
    camera.position.set(0,0, 10);

    controls = new THREE.OrbitControls(camera);
    
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

    fbInit();

}
function animate(){
    window.requestAnimationFrame(animate);
    draw();
}
function draw(){
    // camera.setLens(10)
    time+=0.01;

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

    composer.render();
    // clearColor = new THREE.Color().setHSL((Math.sin(Date.now()*0.001)*0.5 + 0.5), 1.0, 0.5 );
    // renderer.setClearColor(clearColor, 1.0)
    // renderer.render(scene, camera);

    fbDraw();
}
function fbInit(){
    fbScene = new THREE.Scene();
    fbCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    fbCamera.position.set(0,0,0);

    fbRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true});
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
    // fbTexture = new THREE.Texture(renderer.domElement);
    
    fbShaders = [blurShader, reposShader, diffShader, colorShader, sharpenShader];
    // fbShaders = [blurShader, sharpenShader, diffShader, reposShader, sharpenShader];
    // fbShaders = [blurShader, reposShader, diffShader, reposShader, sharpenShader];

    fbMaterial = new FeedbackMaterial(fbRenderer, fbScene, fbCamera, fbTexture, fbShaders);
    
    fbMaterial.init();

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

    fbTexture.needsUpdate = true;
        
    fbMaterial.update();
    fbRenderer.render(fbScene, fbCamera);
    // fbMaterial.expand();
    fbMaterial.getNewFrame();
    fbMaterial.swapBuffers();
    
}