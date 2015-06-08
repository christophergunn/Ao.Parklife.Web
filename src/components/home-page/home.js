define(["knockout", "jquery", "moment", "text!./home.html"], function(ko, $, moment, homeTemplate) {

  function HomeViewModel(route) {
  	var inhabitants = ko.observablearray([
  		{ "Name": "Vincent Lee", "Time":  }
  	]);
  }

  return { viewModel: HomeViewModel, template: homeTemplate };

});
