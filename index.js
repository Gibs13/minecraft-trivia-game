module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'minecraft-trivia-game' );

var questions = require("./questions");

app.pre = function(request, response, type) {
};

app.launch( function( request, response ) {
	response.say('Welcome, say start to begin the game.').shouldEndSession( false );
} );

app.intent('Start',
  function(request,response) {
  	
  	var selectedQuestions = randomizeQuestions(questions);
  	var selectedAnswers = randomizeAnswers(selectedQuestions,questions,0);
  	
    response.session('selectedQuestions',selectedQuestions);
    response.session('selectedAnswers',selectedAnswers);
    response.session('score',0);
    response.session('questionNumber',0);
    response.session('Answered',0)
    response.session('AnswerText','Answers. One. ' + response.session('selectedAnswers')[0] + ' Two. ' + response.session('selectedAnswers')[1] + ' Three. ' + response.session('selectedAnswers')[2] + ' Four. ' + response.session('selectedAnswers')[3]);

    console.log(response.session('selectedQuestions')[0]);
    response.say('Question number one. ' + Object.keys(questions[response.session('selectedQuestions')[0]]) + '. ' + response.session('AnswerText')).shouldEndSession( false );
    app.intent('Answer',
	{
    	"slots":{"number":"NUMBER"}
		,"utterances":[ 
			"My answer is the number {1-4|number}",
			"I think it's the answer number {1-4|number}"]},	
	function(request,response) {
		if (response.session('Answered') == undefined) {
			response.say('There was an error, please say start to begin the game.').shouldEndSession( false );
		} else {
	    var number = request.slot('number');
	    var correct = (response.session('selectedAnswers')[number-1] == questions[response.session('selectedQuestions')[response.session('questionNumber')]][Object.keys(questions[response.session('selectedQuestions')[response.session('questionNumber')]])][0]) ? "correct" : "incorrect";
	    if (correct == "correct" && response.session('Answered') == 0) {
	    	score = response.session('score');
	    	score++;
	    	response.session('score',score);
	    }
	    response.session('Answered',1);
	    response.say(""+correct).shouldEndSession( false );
		}
	});
	app.intent('Next',
	function(request,response) {
		if (response.session('questionNumber') < 1) {
			response.session('Answered',0);
			questionNumber = response.session('questionNumber');
	    	questionNumber++;
	    	response.session('questionNumber',questionNumber);

			selectedAnswers = randomizeAnswers(response.session('selectedQuestions'),questions,response.session('questionNumber'));
			response.session('selectedAnswers',selectedAnswers);

			response.session('AnswerText','Answers. One. ' + response.session('selectedAnswers')[0] + ' Two. ' + response.session('selectedAnswers')[1] + ' Three. ' + response.session('selectedAnswers')[2] + ' Four. ' + response.session('selectedAnswers')[3]);
	    	response.say('Question number ' + (response.session('questionNumber')+1) + '. ' + Object.keys(questions[response.session('selectedQuestions')[response.session('questionNumber')]]) + '. ' + response.session('AnswerText')).shouldEndSession( false );
		}
		else if (response.session('questionNumber') == 1){
			response.say('It was the last question. Your score is ' + response.session('score') + ' points.');
		} else {
			response.say('There was an error, please say start to begin the game.').shouldEndSession( false );
		}
	});
  }
);

app.intent('Stop',
  function(request,response) {
  	response.say('Goodbye.');
  }
);


function randomizeQuestions(questionsList){
	var selectedQuestions = [];
	for (var i=0; i<questionsList.length;i++) {
		selectedQuestions.push(i);
	}
	for (var j=0; j<2;j++) {
		var rand = Math.floor(Math.random()*questionsList.length);
		var temp = selectedQuestions[j];
		selectedQuestions[j] = selectedQuestions[rand];
		selectedQuestions[rand] = temp;
	}
	for (var k=2;k<questionsList.length;k++){
		selectedQuestions.pop();
	}
	return selectedQuestions;
}

function randomizeAnswers(question,questionsList,questionNumber){
	var selectedAnswers = [];
	var AnswerList = questionsList[question[questionNumber]][Object.keys(questionsList[question[questionNumber]])]
	var l = questionsList[question[questionNumber]][Object.keys(questionsList[question[questionNumber]])].length;
	var Answer = Math.floor(Math.random()*4);
	for (var i=0;i<l;i++){
		selectedAnswers.push(i)
	}
	for (var j=1; j<4;j++) {
		var rand = Math.floor(Math.random()*(l-1))+1;
		var temp = selectedAnswers[j];
		selectedAnswers[j] = selectedAnswers[rand];
		selectedAnswers[rand] = temp;
	}
	selectedAnswers[0]=selectedAnswers[Answer];
	selectedAnswers[Answer] = 0;
	for (var k=4;k<l;k++){
		selectedAnswers.pop();
	}
	for (var l=0;l<4;l++){
		selectedAnswers[l] = AnswerList[selectedAnswers[l]]
	}
	return selectedAnswers;
}

module.exports = app;