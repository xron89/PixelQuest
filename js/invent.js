//#############################################################
//
// Invent Functions
//
//#############################################################
function closeInvent () {
	invent_widget.kill();
	moneyTxt.alpha = 0;
	inventItems.alpha = 0;
	inventList = [];
}

function inventRemover () {
	closeInvent();
	for (var i=invent.length-1; i>=0; i--) {
	    if (invent[i] === inventTerm) {
	        invent.splice(i, 1); 
	    }
	}
}

function inventSearch () {
	var inventSearch = invent.indexOf(inventTerm);
	if (inventSearch >= 0) {
		inventSearchResult = true;
	} else {
		inventSearchResult = false; 
	}
}

function openInvent () {
	inventItem();

	invent_widget = game.add.sprite(30, 430, 'invent-widget');
	invent_widget.fixedToCamera = true;
	invent_widget.inputEnabled = true;

	inventItems = game.add.text(37, 468, inventList.toString(), {font: "12px Arial", fill: "#000000", align: 'left'});
	inventItems.fixedToCamera = true;
	inventItems.alpha = 1;
	inventItems.wordWrap = true;
	inventItems.wordWrapWidth = 165;

	moneyTxt = game.add.text(105, 617, money, {font: "15px Arial", fill: "#ffffff", align: 'left'});
	moneyTxt.fixedToCamera = true;
	moneyTxt.alpha = 1;
	invent_widget.events.onInputDown.add(closeInvent, this);
}

function inventItem () {
	invent.sort();

    var currentItem = null;
    var count = 0;
    for (var i = 0; i < invent.length; i++) {
        if (invent[i] != currentItem) {
            if (count > 0) {
                inventList.push(currentItem + ' (' + count + ')');
            }
            currentItem = invent[i];
            count = 1;
        } else {
            count++;
        }
    }
    if (count > 0) {
        inventList.push(currentItem + ' (' + count + ')');
    }
}