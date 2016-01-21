var myId = 0;
var actor;
var player;
var playersList;
var questCompleteFlag = false;
var logo;
var cursors;
var ready = false;
var eurecaServer;

//Export name space for serverside calls

var eurecaClientSetup = function() {
	var eurecaClient = new Eureca.Client();
	
	eurecaClient.ready(function (proxy) {		
		eurecaServer = proxy;
	});
	
	eurecaClient.exports.setId = function(id) {
		myId = id;
		create();
		eurecaServer.handshake();
		ready = true;
	}	
	
	eurecaClient.exports.killActor = function(id) {	
		if (playersList[id]) {
			playersList[id].kill();
			playersList[id].alpha = 0;
		}
	}	
	
	eurecaClient.exports.spawnActor = function(i, x, y) {	
		if (i == myId) return; //The actor

		var act = new Actor(i, game, actor);
		playersList[i] = act;
	}
	
	eurecaClient.exports.updateState = function(id, state) {
		if (playersList[id])  {
			playersList[id].cursor = state;
			playersList[id].actor.x = state.x;
			playersList[id].actor.y = state.y;
			playersList[id].update();
		}

		window.setInterval(function(){
		  randomBird();
		}, 15000);

	}
}


Actor = function (index, game, player) {
	this.cursor = {
		left:false,
		right:false,
		down:false,
		up:false
	}

	this.input = {
		left:false,
		right:false,
		down:false,
		up:false
	}

    var x = 550;
    var y = 550;

    this.game = game;
    this.health = 30;
    this.player = player;
	
    this.alive = true;

    this.actor = game.add.sprite(x, y, 'player');

    this.actor.anchor.set(0.5);

    this.actor.id = index;
    game.physics.enable(this.actor, Phaser.Physics.ARCADE);
    this.actor.body.setSize(10, 16, 0, 0);
    this.actor.enableBody = true;
    this.actor.body.immovable = false;
    this.actor.body.collideWorldBounds = true;

    this.actor.animations.add('down', [6, 7, 8], 10, true);
    this.actor.animations.add('up', [9,10,11], 10, true);
    this.actor.animations.add('left', [0,1,2], 10, true);
    this.actor.animations.add('right', [3,4,5], 10, true);
    this.actor.animations.add('idle', [6], 10, true);

};

Actor.prototype.update = function() {
	
	var inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.down != this.input.down ||
		this.cursor.up != this.input.up
	);
	
	
	if (inputChanged)
	{	
		if (this.actor.id == myId)
		{
			this.input.x = this.actor.x;
			this.input.y = this.actor.y;	
			eurecaServer.handleKeys(this.input);
			
		}
	}
	
	
    if (this.cursor.left)
    {
        this.actor.body.velocity.x = -50;
        this.actor.body.velocity.y = 0;
        this.actor.animations.play('left');
    }
    else if (this.cursor.right)
    {
        this.actor.body.velocity.x = 50;
        this.actor.body.velocity.y = 0;
        this.actor.animations.play('right');
    }
    else if (this.cursor.down)
    {
    	this.actor.body.velocity.x = 0;
        this.actor.body.velocity.y = 50;
        this.actor.animations.play('down');
    } 	
    else if (this.cursor.up)
    {
        this.actor.body.velocity.x = 0;
        this.actor.body.velocity.y = -50;
        this.actor.animations.play('up');
    }
    else 
    {
    	this.actor.body.velocity.x = 0;
    	this.actor.body.velocity.y = 0;
    	this.actor.animations.play('idle');
    }
};

Actor.prototype.killActor = function() {
	this.alive = false;
	this.actor.kill();
}

var game = new Phaser.Game(1040, 720, Phaser.AUTO, 'pixelquest', { preload: preload, create: eurecaClientSetup, update: update, render: render });

//Additional Player variables
var invent = ["Rare Dragon Fruit Seed"];
var inventTerm = "";
var inventList = [];
var inventSearchResult = false;
var exp = 80;
var actorLevel = 1;

//Chat variables
var chatAlertFlag = false;
var chatSent = true;

//Dialog variables
var dialogFlag = false;
var dialogMsg = "";

//Quest Flags
var quest1 = false;
var fenbush = false;
var dialogFlag = false;

//Moneyyyyy
var money = 50;
var flyingEvent = true;

function preload () {
    game.load.image('logo', 'assets/sprites/ui/splash_logo.png');

    //Load the world files
    game.load.tilemap('world', './assets/world/world.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', './assets/world/assets/tileset.png');
    game.load.image('map-set', './assets/world/assets/map-tiles.png');

    //Load Player Sprites
	game.load.spritesheet('player', './assets/sprites/character/player-sprite.png', 19, 26);
	game.load.image('action_body', './assets/sprites/character/action_body.png');
	game.load.spritesheet('old-man', './assets/sprites/character/old-man-sprite.png', 19, 26);
	game.load.spritesheet('police-man', './assets/sprites/character/police-npc.png', 19, 26);
	game.load.spritesheet('big-bird', './assets/sprites/character/bird.png', 35, 32);
	game.load.spritesheet('trades-man', './assets/sprites/character/tradesman.png', 23, 26);
	game.load.spritesheet('mafia-man', './assets/sprites/character/mafiaman.png', 17, 27);

	//Load user interface
	game.load.image('chat-widget', './assets/sprites/ui/chat_area.png');
	game.load.image('player-card', './assets/sprites/ui/player_card.png');
	game.load.image('trainer-btn', './assets/sprites/ui/trainer_btn.png');
	game.load.image('item-btn', './assets/sprites/ui/item_btn.png');
	game.load.image('dialog-widget', './assets/sprites/ui/dialog-widget.png');
	game.load.image('invent-widget', './assets/sprites/ui/invent-widget.png');

	//Quest Sprites
	game.load.image('quest-icon', './assets/sprites/ui/quest_icon.png');
	game.load.image('quest-icon-grey', './assets/sprites/ui/quest_icon_grey.png');
	game.load.image('quest-icon-green', './assets/sprites/ui/quest_icon_green.png');
	game.load.image('fen-bush', './assets/sprites/quest/fenbush.png');
	game.load.image('fen-bush-item', './assets/sprites/quest/invent_berries.png');
	game.load.image('dragon-fruit-item', './assets/sprites/quest/invent_dragon_fruit.png');
}


function create () {

	// Game setup
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.time.desiredFps = 30;
	game.stage.disableVisibilityChange = true;

	// Load the world & collision
	map = game.add.tilemap('world');
	map.addTilesetImage('tileset', 'tileset');
	map.addTilesetImage('map-set', 'map-set');
	collision = map.createLayer('collision');
	warning = map.createLayer('warning');
	sea = map.createLayer('swimming');
	walkable = map.createLayer('walkable');
	map_layer = map.createLayer('map');
	collision.resizeWorld();
	map.setCollisionByExclusion([8], true, 'collision');

	//Load the player
    playersList = {};
	player = new Actor(myId, game, actor);
	playersList[myId] = player;
	actor = player.actor;
	actor.x = 550;
	actor.y = 550;

	action_body = actor.addChild(game.make.sprite(-28, -28, 'action_body'));
    game.physics.enable(action_body, Phaser.Physics.ARCADE);
    action_body.body.setSize(40, 40, 0, 0);
    action_body.alpha = 0;

    //Load the ui
    chat_widget = game.add.sprite(631, 556, 'chat-widget');
    chat_widget.fixedToCamera = true;

    trainer_btn = game.add.sprite(30, 663, 'trainer-btn');
    trainer_btn.fixedToCamera = true;
    trainer_btn.inputEnabled = true;
    trainer_btn.events.onInputDown.add(openPlayerCard, this);

    invent_btn = game.add.sprite(70, 663, 'item-btn');
    invent_btn.fixedToCamera = true;
	invent_btn.inputEnabled = true;
    invent_btn.events.onInputDown.add(openInvent, this);

    //Draw NPC's 
    npcGroup = game.add.group();
	npcGroup.enableBody = true;
    npcGroup.physicsBodyType = Phaser.Physics.ARCADE;

    //Old man
    old_man = game.add.sprite(630, 305, 'old-man'); //Mr_Shou
    game.physics.enable(old_man, Phaser.Physics.ARCADE);
    old_man.body.immovable = true;
    old_man.body.moves = false;
    npcGroup.add(old_man);

    //Police man
    police_man = game.add.sprite(420, 470, 'police-man');
    game.physics.enable(police_man, Phaser.Physics.ARCADE);
    police_man.enableBody = true;
    police_man.body.moves = true;
    police_man.animations.add('idle', [0, 1], 5, true);
    npcGroup.add(police_man);
    
    //Trades man
    trades_man = game.add.sprite(837, 270, 'trades-man');
    game.physics.enable(trades_man, Phaser.Physics.ARCADE);
    trades_man.enableBody = true;
    trades_man.body.moves = false;
    old_man.body.immovable = true;
    trades_man.animations.add('idle', [0, 1], 5, true);
    npcGroup.add(trades_man);

    //Quest Sprites
    fenbushItem = game.add.sprite(160, 160, 'fen-bush');
    game.physics.enable(fenbushItem, Phaser.Physics.ARCADE);
    fenbushItem.enableBody = true;
    fenbushItem.body.setSize(16, 16, 0, 0);
    fenbushItem.body.immovable = false;

    //Quest icon
    questIcon = old_man.addChild(game.make.sprite(1, -17, 'quest-icon'));
    greyQuestIcon = old_man.addChild(game.make.sprite(1, -17, 'quest-icon-grey'));
    greyQuestIcon.alpha = 0;
    greenQuestIcon = old_man.addChild(game.make.sprite(1, -17, 'quest-icon-green'));
    greenQuestIcon.alpha = 0;

	//Splash Screen
    logo = game.add.sprite(0, 0, 'logo');
    logo.fixedToCamera = true;

    //Camera & input
    game.camera.follow(actor);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    cursors = game.input.keyboard.createCursorKeys();
    interactButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //One offs
    policeRandom();
	setTimeout(removeLogo, 5000);

}

function removeLogo () {
    logo.kill();
    chatAlertFlag = true;
	chatBoxMessage = 'Welcome to PixelQuest, we hope you enjoy your adventure!';
	chatAlert();
}

function update () {
	//do not update if client not ready
	if (!ready) return;

	//Collision & Overlaps
	game.physics.arcade.collide(actor, collision);
	game.physics.arcade.collide(actor, old_man);
	game.physics.arcade.collide(actor, police_man);
	game.physics.arcade.collide(actor, trades_man);
	game.physics.arcade.collide(actor, sea);

	game.physics.arcade.collide(police_man, collision);
	game.physics.arcade.collide(police_man, old_man);
	game.physics.arcade.collide(police_man, sea);

	game.physics.arcade.overlap(action_body, old_man, fenbushQuest, null);
	game.physics.arcade.overlap(action_body, fenbushItem, fenbushPicking, null);

	player.input.left = cursors.left.isDown;
	player.input.right = cursors.right.isDown;
	player.input.up = cursors.up.isDown;
	player.input.down = cursors.down.isDown;
	player.input.tx = game.input.x+ game.camera.x;
	player.input.ty = game.input.y+ game.camera.y;

	//Other animations
	police_man.animations.play('idle');

	//Chat widget entry
	if (game.formKeys && !interactButton.useOutside)    {        
		game.input.keyboard.removeKeyCapture(interactButton.keyCode);        
		interactButton.enabled = false;        
		interactButton.useOutside = true;
	}

	if (!game.formKeys)    {        
		interactButton.useOutside = false;        
		game.input.keyboard.addKeyCapture(interactButton.keyCode);        
		interactButton.enabled = true;  
	}    
	
	
    for (var i in playersList)
    {
		if (!playersList[i]) continue;
		var curActor = playersList[i].actor;
		for (var j in playersList)
		{
			if (!playersList[j]) continue;
			if (j!=i) 
			{
				var targetActor = playersList[j].actor;
			}
			if (playersList[j].alive)
			{
				playersList[j].update();
			}			
		}
    }
}

function fenbushQuest () {
	if (quest1 == false && interactButton.isDown) {
		chatAlertFlag = true;
		chatBoxMessage = 'Quest Fenbush berry hunt has been accepted!';
		chatAlert();
		greyQuestIcon.alpha = 1;
		questIcon.alpha = 0;
		dialogMsg = "Wait! You there! I was wondering if you could help me out? I'm in need of some Fresh Fenbush berries to help with my troubling back pain. These berries can be found growing in the grass to the west, bring me back 3 berries and I shall reward you.";
		dialog();
		quest1 = true;
		fenbush = true;
	} else if (quest1 == true && interactButton.isDown ) {
		inventTerm = "Fresh Fenbush Berries";
		inventSearch();
		if (inventSearchResult == true) {
			inventTerm = "Fresh Fenbush Berries";
			inventRemover();
			money += 500;
			actorLevel = 2;
			chatAlertFlag = true;
			chatBoxMessage = "Quest complete! You've been rewarded with 500 coins and 200xp";
			chatAlert();
			greenQuestIcon.alpha = 0;
			dialogMsg = "You're back already! Did you fetch those berries I ask for... You did! Let me take those from you, and in return here...";
			dialog();
		} else {
			chatAlertFlag = true;
			chatAlert();		
		}
	}
}

function policeRandom () {
	setInterval(function(){ 
		policeDirection = Math.floor((Math.random() * 5) + 1);
		policeWalking();
	}, 3500);

	timeOutCounter = Math.floor((Math.random() * 4) + 1);
}

function policeWalking () {
		if(policeDirection == 1) { // Up
			police_man.body.velocity.y = -30;
			police_man.body.velocity.x = 0;
		} else if (policeDirection == 2) { // Down
			police_man.body.velocity.y = 30;
			police_man.body.velocity.x = 0;
		} else if (policeDirection == 3) { //Left
			police_man.body.velocity.x = -30; 
			police_man.body.velocity.y = 0;
		} else if (policeDirection == 4) {
			police_man.body.velocity.x = 0; //Right
			police_man.body.velocity.y = 0;
		} else {
			police_man.body.velocity.x = 0;
			police_man.body.velocity.y = 0;
		}      
}

function openPlayerCard () {
	playerCard_widget = game.add.sprite(30, 430, 'player-card');
	playerCard_widget.fixedToCamera = true;
	playerCard_widget.inputEnabled = true;

	levelText = game.add.text(86, 493, actorLevel, {font: "12px Arial", fill: "#000000", align: 'left'});
	levelText.fixedToCamera = true;
	levelText.alpha = 1;

	nameText = game.add.text(86, 468, myId, {font: "12px Arial", fill: "#000000", align: 'left'});
	nameText.fixedToCamera = true;
	nameText.alpha = 1;

	playerCard_widget.events.onInputDown.add(closePlayerCard, this);
}

function closePlayerCard () {
	playerCard_widget.kill();
	levelText.alpha = 0;
	nameText.alpha = 0;
}

function randomBird () {
	if (flyingEvent == true) {
		big_bird = game.add.sprite(720, 400, 'big-bird');
	    game.physics.enable(big_bird, Phaser.Physics.ARCADE);
	    big_bird.animations.add('fly', [0, 1, 2], 4, true);
	    big_bird.alpha = 0;
	  	big_bird.enableBody = true;
	    big_bird.body.immovable = false;
	    big_bird.body.collideWorldBounds = false;
		big_bird.alpha = 1;

		big_bird.body.velocity.x = -200;
		big_bird.animations.play('fly');
		flyingEvent = false;
	} else {
		//do nothing
	}
}


function fenbushPicking () {
	if (fenbush == true && interactButton.isDown) {
		openInvent();
		closeInvent();
		chatAlertFlag = true;
		chatBoxMessage = 'You pick a bunch of Fresh Fenbush berries from the bush.';
		chatAlert();
		invent.push("Fresh Fenbush Berries");
		greyQuestIcon.alpha = 0;
		greenQuestIcon.alpha = 1;
	} else if (fenbush == true && quest1 == false && interactButton.isDown) {
		chatAlertFlag = true;
		chatAlert();

	} else if (fenbush == false && interactButton.isDown){
		chatAlertFlag = true;
		chatBoxMessage = "I don't think I should pick these Fresh Fenbush berries yet.";
		chatAlert();
	}
}

function render () {}