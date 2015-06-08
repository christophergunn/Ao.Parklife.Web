define(["knockout", "jquery", "moment", "text!./home.html"], function(ko, $, moment, homeTemplate) {

  function HomeViewModel(route) {
  	this.inhabitants = ko.observableArray([
  		{ "Name": "Vincent Lee", "Time": moment().startOf('minute').fromNow() }
  	]);
  }

  return { viewModel: HomeViewModel, template: homeTemplate };

});
