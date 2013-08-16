/*jshint node: true*/
/*global module*/

// Dependencias

var Game = require('../Game.js');
var util = require('../../server/util.js');

// Constantes del juego

var LABELS = [
	'perro', 'gato', 'almohada', 'rata', 'rueda', 'cepillo',
	'terminal', 'ornitorrinco', 'cocina', 'silla', 'edificio',
	'corteza', 'sexto', 'televisor', 'piedra', 'interruptor',
	'tela', 'diamante', 'proceso', 'dentista', 'centro',
	'centeno', 'saltamontes', 'molino', 'coche', 'hormiga'
];

module.exports = function (test, clientURL) {

	// Instanciacion del juego =======================================

	var g = new Game(
		'Careto',  // Nombre del juego
		'MEM',     // Capacidad a estimular
		'MEM-FN',  // Habilidad mental
		clientURL  // URL de la parte (auto)
	);

	test('CARETO: Instanciacion del juego', g, 'El juego Careto no es instanciado correctamente');

	// Definicion de los de los componentes del juego ================

	/**
	 * Genera aleatoriamente un nivel de juego, compuesto
	 * por un conjunto de pares (imagen, etiqueta)
	 * 
	 * @param {number} level Nivel de dificultad
	 */
	var genLevel = function (level) {
		var used = [], index, newLevel = [], label;
		for (var i = 0, len = level + 1; i < len; i++) {
			do {
				index = Math.floor(Math.random() * 20);
			} while(used[index]);
			used[index] = true;
			newLevel.push({
				index: index,
				label: LABELS[Math.floor(Math.random() * LABELS.length)]
			});
		}
		return newLevel;
	};

	/**
	 * Representacion de los jugadores
	 */
	var player1, player2;

	/**
	 * Nivel actual del juego (dificultad) y representacion del nivel (pares imagen-etiqueta)
	 */
	var level, currentLevel;

	/**
	 * Estado del juego
	 */
	var running = false;

	/**
	 * Inicializacion de una partida nueva
	 */
	var init = function () {
		level = 0;
		currentLevel = genLevel(0);
		player1 = {ready: false, points: 0};
		player2 = {ready: false, points: 0};
	};

	init();

	// Logica periodica del juego ====================================

	setInterval(function(){
		if (running) {
			g.emit({
				key: 'update',
				level: level,
				player1: {
					points: player1.points
				},
				player2: {
					points: player2.points
				}
			});
		}
	}, 1000 * 0.5);

	// Receptor de mensajes del cliente ==============================

	g.on = function (msg) {

		switch(msg.key) {

		case 'ready': // Usuario preparado

			// Actualizamos el jugador al que se corresponda
			var player = player1.ready ? player2 : player1;
			player.ready = true;
			player.id = msg.from;
			player.name = msg.name;

			if (player1.ready && player2.ready) {
				// Ambos jugadores estan preparados => el juego empieza
				running = true;
				g.emit({
					key: 'start',
					player1: player1.name,
					player2: player2.name
				});
				g.emit({
					key: 'change-level',
					currentLevel: currentLevel
				});
			} else {
				// Algun jugador aun no esta listo. El otro espera
				g.emit({
					key: 'waiting'
				});
			}

			break;

		case 'exit': // El jugador ha cerrado el juego (el rival gana)

			// Actualizamos el jugador correspondiente
			if (player1.id == msg.from) {
				player1 = {ready: false};
			} else if (player2.id == msg.from) {
				player2 = {ready: false};
			}

			// Si los dos jugadores han cerrado el juego, lo finalizamos
			if (!player1.id && !player2.id) {
				running = false;
				init();
				break;
			}

			// Si solo queda un jugador en pie, este gana
			g.emit({
				key: 'win'
			});

			break;

		case 'level-completed': // Un jugador ha completado el nivel actual

			level++;
			currentLevel = genLevel(level);
			g.emit({
				key: 'change-level',
				currentLevel: currentLevel
			});

			break;

		case 'skip': // Un jugador decide saltar una ronda

			if (!running) {
				break;
			}
			currentLevel = genLevel(level);
			init();
			running = false;
			g.emit({
				key: 'change-level',
				currentLevel: currentLevel
			});

			break;

		default:
			util.error('CARETO', 'Wrong msg type received: ' + msg.key);
		}

	};

	return g;
};
