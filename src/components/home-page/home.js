define(["knockout", "jquery", "text!./home.html"], function(ko, $, homeTemplate) {

  function HomeViewModel(route) {
  	var inhabitants = ko.observablearray();
  }

  return { viewModel: HomeViewModel, template: homeTemplate };

});
