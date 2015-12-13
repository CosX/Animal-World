(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _playground = require("./playground.js");

var _playground2 = _interopRequireDefault(_playground);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modal = document.querySelectorAll(".modal-container")[0];
var form = document.getElementById("AnimalForm");

form.addEventListener("submit", function (event) {
	event.preventDefault();
	var animal = document.querySelector("input[name='animal']:checked").value;
	var name = document.getElementById("name").value;
	if (name !== "") {
		modal.style.display = "none";
		new _playground2.default(name, animal);
	} else {
		alert("Enter name plz!");
	}
});

},{"./playground.js":7}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseAnimal = (function () {
	function BaseAnimal(id, startposition, name, scale, reference, scene) {
		_classCallCheck(this, BaseAnimal);

		this.id = id;
		this.scale = scale;
		this.position = startposition;
		this.target = new THREE.Vector3(0, 0, 0);
		this.group = new THREE.Group();
		this.scene = scene;
		this.speed = 12;
		this.rotation = 0;
		this.moving = false;
		this.rotating = false;
		this.body = reference.clone();
		this.bones = this.getBones();
		this.name = name;
		this.animaltype = "";
		this.options = {
			size: 1.4,
			height: 10,
			curveSegments: 2,
			font: "helvetiker",
			bevelEnabled: false
		};
		var textShapes = THREE.FontUtils.generateShapes(this.name, this.options);
		var text = new THREE.ShapeGeometry(textShapes);
		this.textMesh = new THREE.Mesh(text, new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.DoubleSide }));
		this.textMesh.position.z = -5;
		this.textMesh.position.y = 3;
		this.body.add(this.textMesh);
		this.loadModel();
	}

	_createClass(BaseAnimal, [{
		key: "getBones",
		value: function getBones() {
			throw new Error("Must be implemented by an animal.");
		}
	}, {
		key: "moveTowardsTarget",
		value: function moveTowardsTarget(vec) {
			this.target = vec;
			this.moving = true;
		}
	}, {
		key: "updateMovement",
		value: function updateMovement(mesh) {
			this.body.lookAt(this.target);
			this.body.translateZ(0.5);
			var pos = new THREE.Vector3(this.body.position.x * 1.05 * this.scale, this.body.position.y * 1.05 * this.scale, this.body.position.z * 1.05 * this.scale);
			var center = new THREE.Vector3(0, 0, 0).sub(pos).normalize();
			var raycaster = new THREE.Raycaster(pos, center);
			var intersects = raycaster.intersectObject(mesh);

			if (intersects.length) {
				var point = intersects[0].point;
				var newpoint = new THREE.Vector3(point.x / this.scale, point.y / this.scale, point.z / this.scale);
				this.body.position.copy(newpoint);
				var groundpoint = intersects[0].face.normal;
				var v1 = this.target.clone().sub(this.body.position).normalize();
				var v2 = groundpoint.clone().sub(this.body.position).normalize();
				var v3 = new THREE.Vector3().crossVectors(v1, v2).normalize();
				this.body.up.copy(v3);
				this.body.lookAt(groundpoint);
			}

			var distance = this.body.position.distanceTo(this.target);
			if (distance < 1) {
				this.moving = false;
			}

			this.updateAnimation();
		}
	}, {
		key: "updateAnimation",
		value: function updateAnimation() {
			throw new Error("Must be implemented by an animal.");
		}
	}, {
		key: "remove",
		value: function remove() {
			this.scene.remove(this.group);
		}
	}, {
		key: "loadModel",
		value: function loadModel() {
			this.group.add(this.body);
			this.group.scale.set(this.scale, this.scale, this.scale);
			this.body.position.copy(this.position);
			this.scene.add(this.group);
		}
	}]);

	return BaseAnimal;
})();

exports.default = BaseAnimal;

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatHandler = (function () {
	function ChatHandler() {
		_classCallCheck(this, ChatHandler);

		var self = this;
		var awayclass = "away";

		this.infobox = document.querySelectorAll(".info")[0];
		this.messagebox = document.querySelectorAll(".message-box")[0];
		this.toggler = document.querySelectorAll(".toggle-away")[0];

		this.toggler.addEventListener("click", function () {
			self.infobox.classList.toggle(awayclass);
		}, false);
	}

	_createClass(ChatHandler, [{
		key: "appendMessage",
		value: function appendMessage(name, value) {
			var div = document.createElement('div');
			div.className = 'message';
			div.innerHTML = "<span class=\"name\">" + name + "</span>: <span class=\"value\">" + value + "</span>";
			this.messagebox.appendChild(div);
			this.messagebox.scrollTop = this.messagebox.scrollHeight;
		}
	}]);

	return ChatHandler;
})();

exports.default = ChatHandler;

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _baseanimal = require("./baseanimal.js");

var _baseanimal2 = _interopRequireDefault(_baseanimal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chicken = (function (_BaseAnimal) {
	_inherits(Chicken, _BaseAnimal);

	function Chicken(id, startposition, name, scale, reference, scene) {
		_classCallCheck(this, Chicken);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chicken).call(this, id, startposition, name, scale, reference, scene));

		_this.animaltype = "chicken";
		return _this;
	}

	_createClass(Chicken, [{
		key: "getBones",
		value: function getBones() {
			return [{
				name: "leftleg",
				leg: this.body.skeleton.bones[2],
				goingforward: true
			}, {
				name: "rightleg",
				leg: this.body.skeleton.bones[4],
				goingforward: false
			}];
		}
	}, {
		key: "updateAnimation",
		value: function updateAnimation() {
			this.bones.forEach(function (bone) {
				if (bone.goingforward) {
					bone.leg.rotation.y -= 0.01;
				} else {
					bone.leg.rotation.y += 0.01;
				}

				if (bone.leg.rotation.y > 0.1 || bone.leg.rotation.y < -0.1) {
					bone.goingforward = !bone.goingforward;
				}
			});
		}
	}]);

	return Chicken;
})(_baseanimal2.default);

exports.default = Chicken;

},{"./baseanimal.js":2}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _baseanimal = require("./baseanimal.js");

var _baseanimal2 = _interopRequireDefault(_baseanimal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cow = (function (_BaseAnimal) {
	_inherits(Cow, _BaseAnimal);

	function Cow(id, startposition, name, scale, reference, scene) {
		_classCallCheck(this, Cow);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cow).call(this, id, startposition, name, scale, reference, scene));

		_this.animaltype = "cow";
		return _this;
	}

	_createClass(Cow, [{
		key: "getBones",
		value: function getBones() {
			return [{
				name: "rightbehindleg",
				leg: this.body.skeleton.bones[2],
				goingforward: true
			}, {
				name: "leftbehindleg",
				leg: this.body.skeleton.bones[4],
				goingforward: false
			}, {
				name: "rightfrontleg",
				leg: this.body.skeleton.bones[7],
				goingforward: false
			}, {
				name: "leftfrontleg",
				leg: this.body.skeleton.bones[9],
				goingforward: true
			}];
		}
	}, {
		key: "updateAnimation",
		value: function updateAnimation() {
			this.bones.forEach(function (bone) {
				if (bone.goingforward) {
					bone.leg.rotation.y -= 0.02;
				} else {
					bone.leg.rotation.y += 0.02;
				}

				if (bone.leg.rotation.y > 0.3 || bone.leg.rotation.y < -0.3) {
					bone.goingforward = !bone.goingforward;
				}
			});
		}
	}]);

	return Cow;
})(_baseanimal2.default);

exports.default = Cow;

},{"./baseanimal.js":2}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoadModels = (function () {
	function LoadModels() {
		_classCallCheck(this, LoadModels);

		this.chicken = null;
		this.cow = null;
		this.world = null;
	}

	_createClass(LoadModels, [{
		key: "load",
		value: function load() {
			var _this = this;

			var self = this;
			return new Promise(function (fulfill, reject) {
				self.loadWorld(self).then(function (mesh) {
					_this.world = mesh;
					return self.loadSkeletalModel("./reference/chicken1.json");
				}).then(function (mesh) {
					self.chicken = mesh;
					return self.loadSkeletalModel("./reference/cow.json");
				}).then(function (mesh) {
					self.cow = mesh;
					fulfill();
				});
			});
		}
	}, {
		key: "loadWorld",
		value: function loadWorld(ctx) {
			return new Promise(function (fulfill, reject) {
				var loader = new THREE.JSONLoader();
				loader.load('./reference/World.json', function (geometry, materials) {
					var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
					mesh.receiveShadow = true;
					mesh.castShadow = true;
					fulfill(mesh);
				});
			});
		}
	}, {
		key: "loadSkeletalModel",
		value: function loadSkeletalModel(path) {
			return new Promise(function (fulfill, reject) {
				var loader = new THREE.JSONLoader();
				loader.load(path, function (geometry, materials) {
					for (var i = 0; i < materials.length; i++) {
						var m = materials[i];
						m.skinning = true;
					}

					var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
					mesh.geometry.dynamic = true;
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					fulfill(mesh);
				});
			});
		}
	}]);

	return LoadModels;
})();

exports.default = LoadModels;

},{}],7:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _cow = require("./cow.js");

var _cow2 = _interopRequireDefault(_cow);

var _chicken = require("./chicken.js");

var _chicken2 = _interopRequireDefault(_chicken);

var _world = require("./world.js");

var _world2 = _interopRequireDefault(_world);

var _loadmodels = require("./loadmodels.js");

var _loadmodels2 = _interopRequireDefault(_loadmodels);

var _chatHandler = require("./chatHandler.js");

var _chatHandler2 = _interopRequireDefault(_chatHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Playground = (function () {
	function Playground(name, animal) {
		_classCallCheck(this, Playground);

		var self = this;

		this.socket = null;
		this.isdragging = false;
		this.world;
		this.animal = null;
		this.animals = [];
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);

		this.hemilight;
		this.dirlight;

		this.raycaster = new THREE.Raycaster();
		this.renderer = new THREE.WebGLRenderer({ antialias: true });

		this.camera.position.set(75, 0, -40);
		this.camera.target = new THREE.Vector3(0, 0, 0);
		this.camera.up.set(1, 0, -1);
		this.camera.lookAt(this.camera.target);

		this.setlighting();
		this.setskydome();
		this.setrenderer();

		this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
		this.controls.target.copy(this.camera.target);
		this.controls.noPan = true;
		this.controls.rotateSpeed = 8.0;
		this.controls.minDistance = 20;
		this.controls.maxDistance = 400;

		this.textbox = document.querySelectorAll(".chat")[0];
		this.textboxIsActive = false;
		this.chat = new _chatHandler2.default();

		this.clientClickX = 0;
		this.clientClickY = 0;

		this.textbox.addEventListener("focus", function () {
			self.textboxIsActive = true;
		}, true);

		this.textbox.addEventListener("blur", function () {
			self.textboxIsActive = false;
		}, true);

		this.renderer.domElement.addEventListener("touchend", function (event) {
			self.onMouseUp(self.translateTouchEvent(event));
		}, false);

		this.renderer.domElement.addEventListener("touchstart", function (event) {
			self.onMouseDown(self.translateTouchEvent(event));
		}, false);

		this.renderer.domElement.addEventListener("mouseup", function (event) {
			self.onMouseUp(event);
		}, false);

		this.renderer.domElement.addEventListener("mousedown", function (event) {
			self.onMouseDown(event);
		}, false);

		window.addEventListener("resize", function () {
			self.onWindowResize();
		}, false);
		window.addEventListener("keydown", function (event) {
			self.onKeyDown(event);
		}, false);

		this.reference = new _loadmodels2.default();
		this.reference.load().then(function () {
			self.socket = io.connect("http://localhost:9200/");
			self.initialize(name, animal);
		});
	}

	_createClass(Playground, [{
		key: "initialize",
		value: function initialize(name, animal) {
			var self = this;

			this.world = new _world2.default(this.reference, 500);
			this.world.loadToScene(this.scene);

			this.socket.on("giveid", function (id) {
				var x = 37.049533439151695,
				    y = 504.9169002010969,
				    z = 152.38907703563717;
				self.animal = self.getAnimal(id, name, animal, new THREE.Vector3(x, y, z));

				self.draw();
				self.animal.updateMovement(self.world.mesh);

				self.socket.emit("new animal", {
					x: self.animal.body.position.x,
					y: self.animal.body.position.y,
					z: self.animal.body.position.z,
					name: self.animal.name,
					animaltype: self.animal.animaltype
				});
				self.animal.body.add(self.camera);
			});
			self.socket.on("allplayers", function (data) {
				data.forEach(function (animal) {
					var c = self.getAnimal(animal.id, animal.name, animal.animaltype, new THREE.Vector3(animal.x, animal.y, animal.z));
					c.updateMovement(self.world.mesh);
					self.animals.push(c);
				});
				document.querySelector("#animalcount").textContent = self.animals.length + 1;
			});

			self.socket.on("newplayer", function (animal) {
				var ani = self.getAnimal(animal.id, animal.name, animal.animaltype, new THREE.Vector3(animal.x, animal.y, animal.z));
				ani.updateMovement(self.world.mesh);
				self.animals.push(ani);
				document.querySelector("#animalcount").textContent = self.animals.length + 1;
			});

			self.socket.on("removeplayer", function (data) {
				for (var i = 0; i < self.animals.length; i++) {
					if (self.animals[i].id == data.id) {
						self.animals[i].remove();
						self.animals.splice(i, 1);
						break;
					}
				}
				document.querySelector("#animalcount").textContent = self.animals.length + 1;
			});

			self.socket.on("message", function (animal) {
				self.chat.appendMessage(animal.name, animal.message);
			});

			self.socket.on("move", function (animal) {
				var movinganimal = self.animals.find(function (a) {
					return a.id === animal.id;
				});
				var newpoint = new THREE.Vector3(animal.x, animal.y, animal.z);
				movinganimal.moveTowardsTarget(newpoint);
			});
		}
	}, {
		key: "onMouseDown",
		value: function onMouseDown(event) {
			this.clientClickX = event.clientX;
			this.clientClickY = event.clientY;
		}
	}, {
		key: "onMouseUp",
		value: function onMouseUp(event) {
			var self = this;
			if (event.target !== self.renderer.domElement) {
				return;
			}
			var x = event.clientX;
			var y = event.clientY;
			if (x != self.clientClickX || y != self.clientClickY) {
				return;
			}

			var mouse = {
				x: x / window.innerWidth * 2 - 1,
				y: -(y / window.innerHeight) * 2 + 1
			};
			this.raycaster.setFromCamera(mouse, this.camera);

			var intersects = this.raycaster.intersectObject(this.world.mesh);

			if (intersects.length) {
				var point = intersects[0].point;
				var newpoint = new THREE.Vector3(point.x / self.animal.scale, point.y / self.animal.scale, point.z / self.animal.scale);
				self.animal.moveTowardsTarget(newpoint);

				self.socket.emit("move animal", {
					x: newpoint.x,
					y: newpoint.y,
					z: newpoint.z
				});
			}
		}
	}, {
		key: "getAnimal",
		value: function getAnimal(id, name, animal, pos) {
			if (animal === "cow") {
				return new _cow2.default(id, pos, name, 4, this.reference.cow, this.scene);
			} else {
				return new _chicken2.default(id, pos, name, 4, this.reference.chicken, this.scene);
			}
		}
	}, {
		key: "onKeyDown",
		value: function onKeyDown(event) {
			var self = this;
			var keyCode = event.keyCode;
			if (this.textboxIsActive && keyCode === 13 && self.textbox.value !== "") {
				self.socket.emit("new message", {
					message: self.textbox.value
				});
				self.chat.appendMessage(self.animal.name, self.textbox.value);
				self.textbox.value = "";
			}
		}
	}, {
		key: "onWindowResize",
		value: function onWindowResize() {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}, {
		key: "translateTouchEvent",
		value: function translateTouchEvent(e) {
			e.stopPropagation();
			e.preventDefault();
			if (e.touches.length) {
				return {
					clientX: e.touches[0].clientX,
					clientY: e.touches[0].clientY,
					preventDefault: e.preventDefault,
					target: this.renderer.domElement
				};
			} else {
				return {
					clientX: e.changedTouches[0].clientX,
					clientY: e.changedTouches[0].clientY,
					preventDefault: e.preventDefault,
					target: this.renderer.domElement
				};
			}
		}
	}, {
		key: "setskydome",
		value: function setskydome() {
			this.scene.fog = new THREE.Fog(0xffffff, 1, 5000);
			this.scene.fog.color.setHSL(0.6, 0, 1);

			var vertexShader = document.getElementById('vertexShader').textContent;
			var fragmentShader = document.getElementById('fragmentShader').textContent;
			var uniforms = {
				topColor: { type: "c", value: new THREE.Color(0x264348) },
				bottomColor: { type: "c", value: new THREE.Color(0x044F67) },
				offset: { type: "f", value: 33 },
				exponent: { type: "f", value: 0.6 }
			};
			//uniforms.topColor.value.copy( this.hemilight.color );

			this.scene.fog.color.copy(uniforms.bottomColor.value);

			var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
			var skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide });

			var sky = new THREE.Mesh(skyGeo, skyMat);
			this.scene.add(sky);
		}
	}, {
		key: "setlighting",
		value: function setlighting() {
			this.hemilight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
			this.hemilight.color.setHSL(0.6, 1, 0.6);
			this.hemilight.groundColor.setHSL(0.095, 1, 0.75);
			this.hemilight.position.set(0, 500, 0);
			this.scene.add(this.hemilight);

			this.dirlight = new THREE.DirectionalLight(0xffffff, 1);
			this.dirlight.color.setHSL(0.1, 1, 0.95);
			this.dirlight.position.set(-1, 1.75, 1);
			this.dirlight.position.multiplyScalar(50);
			this.scene.add(this.dirlight);

			this.dirlight.castShadow = true;

			this.dirlight.shadowMapWidth = 2048;
			this.dirlight.shadowMapHeight = 2048;

			var d = 50;

			this.dirlight.shadowCameraLeft = -d;
			this.dirlight.shadowCameraRight = d;
			this.dirlight.shadowCameraTop = d;
			this.dirlight.shadowCameraBottom = -d;

			this.dirlight.shadowCameraFar = 3500;
			this.dirlight.shadowBias = -0.0001;
		}
	}, {
		key: "setrenderer",
		value: function setrenderer() {
			this.renderer.setClearColor("#CCCCCC");
			this.renderer.sortObjects = false;
			this.renderer.autoClear = false;
			this.renderer.gammaInput = true;
			this.renderer.gammaOutput = true;
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.shadowMapEnabled = true;
			this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
			var container = document.createElement('div');
			document.body.appendChild(container);
			container.appendChild(this.renderer.domElement);
		}
	}, {
		key: "draw",
		value: function draw() {
			var self = this;
			window.requestAnimationFrame(function () {
				self.draw();
			});
			this.renderer.clear();
			this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
			this.renderer.render(this.scene, this.camera);
			this.controls.update();

			self.handleMovement(self.animal);

			self.animals.forEach(function (animal) {
				self.handleMovement(animal);
			});
		}
	}, {
		key: "handleMovement",
		value: function handleMovement(animal) {
			if (animal.moving) {
				animal.updateMovement(this.world.mesh, this.scene);
			}
			animal.textMesh.lookAt(this.camera.position);
			animal.textMesh.up.copy(this.camera.up);
		}
	}]);

	return Playground;
})();

exports.default = Playground;

},{"./chatHandler.js":3,"./chicken.js":4,"./cow.js":5,"./loadmodels.js":6,"./world.js":8}],8:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var World = (function () {
	function World(reference, scale) {
		_classCallCheck(this, World);

		this.scale = scale;
		this.mesh = reference.world.clone();
	}

	_createClass(World, [{
		key: "loadToScene",
		value: function loadToScene(scene) {
			this.mesh.scale.set(this.scale, this.scale, this.scale);
			scene.add(this.mesh);
		}
	}]);

	return World;
})();

exports.default = World;

},{}]},{},[1])


//# sourceMappingURL=compiled.js.map
