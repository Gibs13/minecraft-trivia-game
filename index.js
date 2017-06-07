module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'minecraft-trivia-game' );

var questions = require("./questions");

app.launch( function( request, response ) {
	delete app.intent('Next');
	delete app.intent('Answer');
	response.say('Welcome, say start to begin the game.').shouldEndSession( false );
} );

app.intent('Start',
  function(request,response) {
  	var Answered = 0;
  	var score = 0;
  	var selectedQuestions = randomizeQuestions(questions);
  	var questionNumber = 0;
  	var selectedAnswers = randomizeAnswers(selectedQuestions,questions,0);
  	var AnswerText = 'Answers. One. ' + selectedAnswers[0] + ' Two. ' + selectedAnswers[1] + ' Three. ' + selectedAnswers[2] + ' Four. ' + selectedAnswers[3];
    response.say('Question number one. ' + Object.keys(questions[selectedQuestions[0]]) + '. ' + AnswerText).shouldEndSession( false );
    app.intent('Answer',
	{
    	"slots":{"number":"NUMBER"}
		,"utterances":[ 
			"My answer is the number {1-4|number}",
			"I think it's the answer number {1-4|number}"]
	},
	function(request,response) {
	    var number = request.slot('number');
	    var correct = (selectedAnswers[number-1] == questions[selectedQuestions[questionNumber]][Object.keys(questions[selectedQuestions[questionNumber]])][0]) ? "correct" : "incorrect";
	    if (correct == "correct" && Answered == 0) {
	    	score++;
	    }
	    Answered = 1;
	    response.say(""+correct).shouldEndSession( false );
	});
	app.intent('Next',
	function(request,response) {
		if (questionNumber<1) {
			Answered = 0;
	    	questionNumber++;
			selectedAnswers = randomizeAnswers(selectedQuestions,questions,questionNumber);
			AnswerText = 'Answers. One. ' + selectedAnswers[0] + ' Two. ' + selectedAnswers[1] + ' Three. ' + selectedAnswers[2] + ' Four. ' + selectedAnswers[3];
	    	response.say('Question number ' + (questionNumber+1) + '. ' + Object.keys(questions[selectedQuestions[questionNumber]]) + '. ' + AnswerText).shouldEndSession( false );
		}
		else {
			response.say('It was the last question. Your score is ' + score + ' points.');
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
	console.log();
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