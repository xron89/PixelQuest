//#############################################################
//
// Dialog Functions
//
//#############################################################
function dialog () {
	dialog_widget = game.add.sprite(320, 220, 'dialog-widget');
    dialog_widget.fixedToCamera = true;
    dialogTxtStyle = {font: "14px Arial", fill: "#ffffff", align: 'left', wordWrap: true, wordWrapWidth: 380 };
    dialogTxt = game.add.text(340, 230, dialogMsg, dialogTxtStyle);
    dialogTxt.fixedToCamera = true;
    dialogTxt.alpha = 1;
    dialog_widget.inputEnabled = true;
    dialog_widget.events.onInputDown.add(closeDialog, this);
}

function closeDialog() {
	dialogTxt.alpha = 0;
	dialog_widget.kill();
}


function chatAlert () {
	oldMsg = $('.chat-message').last().html();
	if (oldMsg == chatBoxMessage) {
		
	} else {
		if (chatAlertFlag == true) {
		    var elementDiv = document.createElement("div");
		    elementDiv.className = "chat-message error";
		    elementDiv.appendChild(document.createTextNode(chatBoxMessage));
		    document.getElementById('message-window').appendChild(elementDiv);
		    chatAlertFlag = false;
		} else {

		}
	}
}