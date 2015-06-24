function FeedbackMaterial(RENDERER, SCENE, CAMERA, TEXTURE, SHADERS){

    this.renderer = RENDERER;
    this.scene = SCENE;
    this.camera = CAMERA;
    this.texture = TEXTURE;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.shader1 = SHADERS[0];
    this.shader2 = SHADERS[1];
    this.shader3 = SHADERS[2];
    this.shader4 = SHADERS[3];
    this.shader5 = SHADERS[4];
    this.shader = SHADERS[5]

    this.mesh;
    
    //this.geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    
    
    this.fbos = [];
    this.init = function(){

        this.fbo1 = new FeedbackObject(this.shader1);
        this.fbo1.material.uniforms.texture.value = this.texture;

        this.fbo2 = new FeedbackObject(this.shader2); 
        this.fbo2.material.uniforms.texture.value = this.fbo1.renderTarget;

        this.frameDiff = new FeedbackObject(this.shader3); 
        this.frameDiff.material.uniforms.texture.value = this.fbo1.renderTarget;
        this.frameDiff.material.uniforms.texture2.value = this.fbo2.renderTarget;
        this.frameDiff.material.uniforms.texture3.value = this.texture;

        this.fbo3 = new FeedbackObject(this.shader4); 
        this.fbo3.material.uniforms.texture.value = this.frameDiff.renderTarget;

        this.fbo4 = new FeedbackObject(this.shader5); 
        this.fbo4.material.uniforms.texture.value = this.fbo3.renderTarget;

        this.fbos.push(this.fbo1);
        this.fbos.push(this.fbo2);
        this.fbos.push(this.frameDiff);
        this.fbos.push(this.fbo3);
        this.fbos.push(this.fbo4);
        
        for(var i = 0; i < this.fbos.length; i++){
          this.fbos[i].material.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
        }
        
        this.fbo1.material.uniforms.texture.value = this.frameDiff.renderTarget; 

        // this.material = new THREE.MeshBasicMaterial({
        //     color: 0xffffff,
        //     map: this.fbo4.renderTarget
        // });
        // var shader = alphaShader;
        this.material = new THREE.ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader,
            transparent: true,
            side: 2
        });
        this.material.uniforms["texture"].value = this.fbo4.renderTarget;
        
        // this.material.depthTest = false;
        // this.material.depthWrite = false;
        // this.geometry = new THREE.PlaneGeometry(637, 840, 0);
        // this.geometry = new THREE.PlaneGeometry(3864/3,2579/3, 0);
        this.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 0);
        // this.geometry = new THREE.BoxGeometry(1000,1000,1000);

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0,0,0);
        // this.mesh.rotation.set(0,0,Math.PI/2);
        this.scene.add(this.mesh);      

        var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1500,1500), new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("tex/2.jpg")}));
        // var mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        mesh.position.z = -100;
        // this.scene.add(mesh);
        // this.mesh.position.z = -100;  
    }

    this.resize = function(){
        for(var i = 0; i < this.fbos.length; i++){
          this.fbos[i].material.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
        }
    }

    this.update = function(){
        this.fbo2.render(this.renderer, this.camera);
        this.frameDiff.render(this.renderer, this.camera);
        this.fbo3.render(this.renderer, this.camera);
        this.fbo4.render(this.renderer, this.camera);
    }
    this.expand = function(){
        this.frameDiff.mesh.scale.set(1.01,1.01,1.01);
    }
    this.getNewFrame = function(){
        this.fbo1.render(this.renderer, this.camera);
    }
    this.swapBuffers = function(){
        var a = this.fbo3.renderTarget;
        this.fbo3.renderTarget = this.fbo1.renderTarget;
        this.fbo1.renderTarget = a;
    }
}
function FeedbackObject(SHADER) {
    this.scene = new THREE.Scene();
    this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat});
    this.shader = SHADER;
    this.material = new THREE.ShaderMaterial({
        uniforms: this.shader.uniforms,
        vertexShader: this.shader.vertexShader,
        fragmentShader: this.shader.fragmentShader    
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight), this.material);
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);

    this.render = function(RENDERER, CAMERA){
        RENDERER.render(this.scene, CAMERA, this.renderTarget, true);
    }
}