var userA = {
	keywords: ['a', 'b', 'c', 'd', 'e', 'f'],
	interests: ['1', '2', '3', '4'],
	brain: {
		memory: 0,
		speed: 0,
		'problem-solving': 0
	}
};

var userB = {
	keywords: ['a', 'b', 'c', 'd'],
	interests: ['1', '8', '0', '5', '12'],
	brain: {
		memory: 1,
		speed: 1,
		'problem-solving': 0.2
	}
};



/**
 * Calcula la similitud entre 2 usuarios
 * @param {object} user1 Primer usuario
 * @param {object} user2 Segundo usuario
 * @returns {number} Similitud entre usuarios [0-1]
 */
var usersSimilarity = function (user1, user2) {

	/**
	 * Calcula la similitud entre dos vectores de keywords
	 */
	var keywordsSimilarity = function (keywords1, keywords2) {

		var maxLen = Math.max(keywords1.length, keywords2.length);
		var intersection = keywords1.filter(function (elem) {
			return keywords2.indexOf(elem) >= 0;
		});
		return intersection.length / maxLen;
	};

	/**
	 * Calcula la similitud entre dos vectores de intereses
	 */
	var interestsSimilarity = function (interests1, interests2) {

		return keywordsSimilarity(interests1, interests2);
	};

	/**
	 * Calcula la similitud entre las capacidades mentales de dos sujetos
	 */
	var capacitiesSimilarity = function (brain1, brain2) {

		var similarity = 0;
		var len = 0;
		for (var capacity in brain1) {
			var cap1 = brain1[capacity];
			var cap2 = brain2[capacity];
			var diff = Math.abs(cap1 - cap2);
			similarity += 1 - diff;
			len ++;
		}
		return similarity / len;
	};

	var keywordsSim = keywordsSimilarity(user1.keywords, user2.keywords);
	var interestsSim = interestsSimilarity(user1.interests, user2.interests);
	var brainSim = capacitiesSimilarity(user1.brain, user2.brain);

	return (keywordsSim + interestsSim + brainSim) / 3;
};
