
var express = require('express');
var router = express.Router();
var colors = require('colors');
var mongoose = require('mongoose');


mongoose.connect('mongodb://portfolioUser1:huj23Kll!00@ds045694.mongolab.com:45694/portfolio');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//Create Project Schema
var ProjectSchemaBlueprint = new Schema({
    title     : String,
    desc      : String,
    dateRange : String,
    images    : [String],
    techs     : [String],
});
mongoose.model('Project', ProjectSchemaBlueprint)
var ProjectSchema = mongoose.model('Project');

//Create generic info schema
var GenericInfoSchemaBlueprint = new Schema({
    fullname     : String,
    bio      : String
});
mongoose.model('GenericInfo', GenericInfoSchemaBlueprint)
var GenericInfoSchema = mongoose.model('GenericInfo');

/* GET home page. */
router.get('/', function(req, res, next) {
	

	// var post = new BlogPost();
	// post.title = "Post 1";
	// post.author = instance._id;

	const Browser = require('zombie');

	const browser = new Browser();
	browser.visit('https://www.linkedin.com/in/alex-pelletier-51733a72');
	browser.wait(function() {
        var env = require('jsdom').env
		env(browser.html(), function (errors, window) {
			var $ = require('jquery')(window);

			var fullname = $(".profile-overview-content #name").text();
			var summary = $("#summary p").text();

			//Save generic info
			GenericInfoSchema.find({}, function (err, docs) {
				docs.forEach(function(doc){
					doc.remove();
				});
			});
			genericInfo = new GenericInfoSchema();
			genericInfo.fullname = fullname;
			genericInfo.bio = summary
			genericInfo.save();


			var projects = $("#projects .project");
			$.each(projects, function(id, projectEl){ //get & save the info for each project
				var title = $(projectEl).find(".item-title a").text();
				var link = $(projectEl).find(".item-title a").attr('href');
				var desc = $(projectEl).find(".description").text();
				
				var dateRange = ""
				$(projectEl).find(".date-range time").each(function(index, el) {
					dateRange += (dateRange != "") ? " - " : "";
					dateRange += $(el).text()
				});

				//store info to new mongoose obj
				var project = null
				ProjectSchema.find({title: title}, function (err, docs) {
					project = docs[0];
					console.log("Found Project: ".green + title);
				});
				if (project == null){
					project = new ProjectSchema();
					project.title = title;
					console.log("Created Project: ".yellow + title);
				}
				project.desc = desc;
				project.dateRange = dateRange;
				project.save();
			});

			console.log("Fullname: ".green + fullname);
			console.log("Number Of Projects: ".green + projects.length);
		});
    });


	res.send("Done");
});

module.exports = router;
