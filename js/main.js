var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');
game.state.add('Game', Game);
game.state.start('Game');

