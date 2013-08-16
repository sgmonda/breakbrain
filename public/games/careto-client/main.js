window.game = (function() {

	// Mensaje central del juego

	var message = new Text('hola', "20px Arial", "black");
	message.textAlign = "right";
	message.x = 580;
	message.y = 450;
	message.maxWidth = 500;
	stage.addChild(message);

	// Informacion del jugador 1

	var player1 = {
		name: new Text('', "20px Arial", "black"),
		level: new Text('', "15px Arial", "black")
	};
	player1.name.textAlign = "center";
	player1.name.x = 150;
	player1.name.y = 10;
	player1.name.maxWidth=250;
	stage.addChild(player1.name);

	player1.level.textAlign = "center";
	player1.level.x = 150;
	player1.level.y = 40;
	player1.level.maxWidth=250;
	stage.addChild(player1.level);

	// Informacion del jugador 2

	var player2 = {
		name: new Text('', "20px Arial", "black"),
		level: new Text('', "15px Arial", "black")
	};
	player2.name.textAlign = "center";
	player2.name.x = 450;
	player2.name.y = 10;
	player2.name.maxWidth=250;
	stage.addChild(player2.name);

	player2.level.textAlign = "center";
	player2.level.x = 450;
	player2.level.y = 40;
	player2.level.maxWidth=250;
	stage.addChild(player2.level);

	// Nivel de juego

	var level = new Text('', '20px Arial', 'black');
	level.textAlign = 'left';
	level.x = 10;
	level.y = 450;
	level.maxWidth = 300;
	stage.addChild(level);

	/**
	 * Pinta un par (imagen, etiqueta) en una posicion determinada del canvas
	 * 
	 * @param {number} index Imagen a pintar
	 * @param {number} x Posicion horizontal
	 * @param {number} y Posicion vertical
	 * @param {string} label Etiqueta asociada a la imagen
	 */
	var paintImage = function (index, x, y, label) {

		var aux = new Image();
		aux.src = "/games/careto-client/braille" + index + ".png";

		var img = new createjs.Bitmap(aux);
		img.x = x;
		img.y = y;
		stage.addChild(img);

		if (label) {
			label = new Text(label, '15px Arial', 'black');
			label.textAlign = 'center';
			label.x = x + 30;
			label.y = y + 95;
			stage.addChild(label);
		}

		return {image: img, label: label, x: x, y: y, width: 60, height: 100};
	};

	/**
	 * Pinta un conjunto de pares (imagen, etiqueta)
	 * 
	 * @param {array} images Pares (imagen, etiqueta) a pintar
	 */
	var paintImages = function (images) {
		var x = 70, y = 80;
		images.forEach(function (img) {
			img.stageChild = paintImage(img.index, x, y, img.label);
			x += 80;
			if (x > 500) {
				x = 70;
				y += 120;
			}
		});
	};

	/**
	 * Limpia el stage de CreativeJS, eliminando los pares (imagen, etiqueta)
	 * asociados al nivel de juego actual
	 */
	var removeLevelFromStage = function () {
		currentLevel.forEach(function (elem) {
			var pair = elem.stageChild;
			stage.removeChild(pair.image);
			stage.removeChild(pair.label);
		});
	};

	/**
	 * Randomiza un vector de elementos, asignando a cada uno una
	 * posicion aleatoria del mismo.
	 * 
	 * @param {array} o Vector a revolver
	 */
	var suffle = function (o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
	};

	/**
	 * Nivel actual
	 */
	var currentLevel = [];

	/**
	 * Estado del juego
	 */
	var playing = false;

	/**
	 * Intervalo periodico de cuenta atras
	 */
	var interval = null;

	/**
	 * Establece el nivel actual de juego
	 * 
	 * @param {array} newLevel Vector de pares (imagen, etiqueta) asociados
	 * al nuevo nivel de juego.
	 */
	var setCurrentLevel = function (newLevel) {

		// Eliminamos pares anteriores
		removeLevelFromStage();
		// Establecemos el nuevo nivel como nivel de juego
		currentLevel = newLevel;
		// Pintamos el nuevo nivel
		paintImages(newLevel);

		// Asignamos un valor a la cuenta atras de la memorizacion
		var countdown = currentLevel.length * 5;
		playing = false;

		if (interval) {
			clearTimeout(interval);
		}

		// Iniciamos la cuenta atras
		interval = setInterval(function () {
			if (countdown <= 0) {
				if (playing) {
					sendMessage({key: 'skip'});
					return;
				}
				countdown = -1;
				message.text = '';
				playing = true;

				// Eliminamos los pares actuales, para repintarlos aleatoriamente
				removeLevelFromStage();
				// Pintamos de nuevo los pares, de forma aleatoria y semitransparente
				paintImages(suffle(newLevel));
				currentLevel.forEach(function (elem) {
					elem.stageChild.image.alpha = 0.5;
					elem.stageChild.label.text = '';
				});

				// Establecemos la cuenta atras para resolver el nivel
				countdown = currentLevel.length * 10;
				message.text = 'Quedan ' + countdown + ' segundos';
				return;
			}
			countdown--;
			message.text = 'Quedan ' + countdown + ' segundos';
		}, 1000);
	};

	/**
	 * Comprueba a que elemento le corresponde una posicion absoluta en pixels
	 * 
	 * @param {number} x Posicion horizontal
	 * @param {number} y Posicion vertical
	 * @returns Elemento par (imagen, etiqueta) en el que el pixel (x,y) cae
	 */
	var whichElement = function (x, y) {
		for (var i = 0, length = currentLevel.length; i < length; i++) {
			var image = currentLevel[i].stageChild;
			if (x > image.x && x < (image.x + image.width) && y > image.y && y < (image.y + image.height)) {
				return currentLevel[i];
			}
		}
	};

	return {

		start: function() {
			// Esta funcion es llamada al cargar el juego
			sendMessage({key: 'ready', name: user.realname});
		},

		tick: function() {
			// Esta funcion es llamada en cada refresco periodico
		},

		keydown: function(key) {
			// Esta funcion es llamada cuando una tecla es pulsada
		},

		keyup: function(key) {
			// Esta funcion es llamada cuando una tecla es liberada
		},

		mousedown: function(x, y) {
			if (!playing) {
				return;
			}

			// Comprobamos sobre que elemnto se ha hecho click
			var elem = whichElement(x, y);
			if (elem) {
				// Solicitamos la etiqueta sociada a ese elemento
				var label = prompt('Etiqueta para esta imagen');
				if (label) {
					// Resaltamos el elemento como resuelto y le asignamos la etiqueta
					elem.stageChild.label.text = label;
					elem.stageChild.image.alpha = 1;
					// Si la etiqueta es correcta, la pintamos de verde, si no de rojo
					if (elem.label == label) {
						elem.stageChild.label.color = 'green';
					} else {
						elem.stageChild.label.color = 'red';
					}
					// Comprobamos si ya ha resuelto todos los pares (imagen, etiqueta)
					for(var i = 0, len = currentLevel.length; i < len; i++){
						var aux = currentLevel[i].stageChild.label;
						if (!aux.text || aux.color != 'green') {
							return;
						}
					}
					sendMessage({key: 'level-completed'});
					alert('Nivel completado');
				}
			}
		},

		mouseup: function(x, y){
			// Esta funcion es llamada cuando el raton es soltado
		},

		mousemove: function(x, y){
			var elem = whichElement(x, y);
			if (elem) {
				$('#game')[0].style.cursor = 'pointer';
			} else {
				$('#game')[0].style.cursor = 'auto';
			}
		},

		stop: function(){
			// Esta funcion es llamada si el cliente cierra el juego
			sendMessage({key: 'exit'});
		},

		/**
		 * Recibe un mensaje del servidor
		 */
		onMessage: function(msg) {

			switch(msg.key) {

			case 'waiting': // Se debe esperar al rival
				message.text = 'Esperando al rival';
				break;

			case 'start': // El juego empieza
				player1.name.text = msg.player1;
				player2.name.text = msg.player2;
				message.text = '';
				break;

			case 'win': // El juego ha terminado y el usuario es el ganador
				message.text = 'Eres el ganador!';
				clearTimeout(interval);
				break;

			case 'update': // El juego ha sufrido una actualizacion
				player1.level.text = msg.player1.points + ' puntos';
				player2.level.text = msg.player2.points + ' puntos';
				level.text = 'Nivel ' + msg.level;
				break;

			case 'change-level': // El nivel de juego ha cambiado
				setCurrentLevel(msg.currentLevel);
				break;
			}
		}
	};
})();
