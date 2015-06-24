function GradientMesh(SCENE, WIDTH, HEIGHT){
	this.gradient;
	this.geometry;
	this.texture, this.material;
	this.mesh;

	this.scene = SCENE;
	this.width = WIDTH;
	this.height = HEIGHT;

	this.useObj = false;
	this.model = "obj/hand.obj";

	this.init = function(index){

		this.gradient = new Gradient(this.width, this.height);
		this.gradient.init();

		this.texture = new THREE.Texture(this.gradient.canvas);
		// this.geometry = new THREE.IcosahedronGeometry(100,2);
		this.stripeTexture = THREE.ImageUtils.loadTexture("tex/stripe.png");
		this.stripeTexture.minFilter = this.stripeTexture.magFilter = THREE.NearestFilter;

		// this.geometry = new THREE.BoxGeometry(100,100,100, Math.floor(Math.random()*10, Math.floor(Math.random()*10, Math.floor(Math.random()*10))));
		this.material = new THREE.MeshBasicMaterial({map: this.texture, side: 2});

		if(this.useObj){
			loadModel.call(this, this.model, this.material);
		} else {
			// this.geometry = new THREE.PlaneBufferGeometry(window.innerWidth/75,window.innerHeight/75, Math.floor(Math.random()*10));
			this.geometry = new THREE.IcosahedronGeometry(20,3);
			// this.geometry = new THREE.SphereGeometry(100,100,100);
			// this.geometry = new THREE.DodecahedronGeometry(20,1)
			// this.geometry = new THREE.BoxGeometry(100,100,100,Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10));
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.scene.add(this.mesh);


		}
		// loadModel.bind(this);
		// this.mesh = obj;
		// console.log(obj);
		// this.material = new THREE.ShaderMaterial({
		// 	uniforms: passThroughShader.uniforms,
		// 	vertexShader: passThroughShader.vertexShader,
		// 	fragmentShader: passThroughShader.fragmentShader,
		// 	transparent: true,
		// 	side:2
		// });
		// this.material.uniforms["texture"].value = this.texture;
		// this.material.uniforms["texture2"].value = this.stripeTexture;

	}

	this.update = function(){
		this.texture.needsUpdate = true;
		this.gradient.update();

	}
}

function Gradient(WIDTH, HEIGHT){
	this.canvas, this.context;
	this.width, this.height;
	this.colors = [];
	this.hue, this.saturation, this.lightness, this.alpha;
	this.offset;
	this.init = function(){
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.canvas.width = WIDTH;
		this.canvas.height = HEIGHT;
		this.hue = Math.random()*360;
		this.saturation = Math.random()*100;
		this.lightness = Math.random()*55 + 45;
		this.alpha = 1.0;
		this.offset = 100;
	}

	this.update = function(){
		this.sampleColors();
		this.gradient=this.context.createLinearGradient(0,0,this.canvas.width,this.canvas.height);
		this.gradient.addColorStop(0, this.colors[0]);
		this.gradient.addColorStop(1, this.colors[1]);
		this.context.fillStyle=this.gradient;
		this.context.fillRect(0,0,this.canvas.width, this.canvas.height);

		this.hue += 0.5;
	}

	this.sampleColors = function(){
		this.colors[0] = hslaColor(this.hue, this.saturation, this.lightness, this.alpha)
		this.colors[1] = hslaColor(this.hue + this.offset, this.saturation, this.lightness, this.alpha)
	}

}