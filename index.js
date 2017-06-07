module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'minecraft-trivia-game' );

app.dictionary = {"numbers":["one","two","three","four"]};

var questions = require("./questions");
var state = "";

app.launch( function( request, response ) {
	response.say('Welcome').shouldEndSession( false );
} );

app.intent('Start',
  function(request,response) {
  	var selectedQuestions = randomizeQuestions(questions);
  	var selectedAnswers = randomizeAnswers(selectedQuestions,questions,0);
    response.say('Question number one.' + Object.keys(questions[selectedQuestions[0]]) + 'Answers. One. ' + selectedAnswers[0]).shouldEndSession( false );
  }
);

app.intent('Answer',
	{
    	"slots":{"number":"NUMBER"}
		,"utterances":[ 
			"My answer is the number {numbers|number}",
			"I think it's the answer number {numbers|number}"]
	},
	function(request,response) {
	    var number = request.slot('number');
	    response.say("You asked for the number "+selectedAnswers[0]).shouldEndSession( false );
	});


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