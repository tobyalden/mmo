var Game = {};

Game.init = function() {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap(
        'map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON
    );
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
    game.load.image('sprite','assets/sprites/sprite.png');
};

Game.create = function() {
    Game.playerMap = {};
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset');
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i)
    }
    layer.inputEnabled = true;
    layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
}

Game.addNewPlayer = function(id, x, y) {
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
}

Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
}

Game.getCoordinates = function(layer, pointer) {
    Client.sendClick(pointer.worldX, pointer.worldY);
}
