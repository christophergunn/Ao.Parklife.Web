define(["knockout", "jquery", "moment", "lodash", "text!./home.html"],
	   function(ko, $, moment, _, homeTemplate) {

	var Inhabitant = function(id, name, inDateTime) {
		var self = this
		self.Id = id
		self.Name = name
		self.InDateTime = moment(inDateTime).startOf('minute').fromNow()
	}

  function HomeViewModel(route) {
  	var self = this
  	self.inhabitants = ko.observableArray([
  		new Inhabitant(1, "Vince Lee", moment()),
  		new Inhabitant(2, "Chris Gunn", moment()),
  		new Inhabitant(3, "Raj Eridisinghe", moment()),
  	]);

  	self.showElement = function(elem) { console.log("show " + elem); if (elem.nodeType === 1) $(elem).hide().fadeIn("fast") }
    self.hideElement = function(elem) { console.log("hide " + elem); if (elem.nodeType === 1) $(elem).fadeOut("fast", function() { $(elem).remove(); }) }

    self.add = function() {
    	var inhabitants = self.inhabitants()
    	inhabitants.push(new Inhabitant(4, "Mo Mulla", moment()))
    	self.inhabitants(inhabitants)
    }

    self.remove = function(row, event) {
    	var inhabitants = _.filter(self.inhabitants(), function(x) {
    		console.log(x)
    		console.log(row)
    		console.log(x.Name !== row.Name)
    		return x.Name !== row.Name
    	})
    	console.log(inhabitants)
    	self.inhabitants(inhabitants) 
    }
  }


  return { viewModel: HomeViewModel, template: homeTemplate };

});
