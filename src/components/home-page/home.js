define(["knockout", "jquery", "moment", "lodash", "text!./home.html"],
	   function(ko, $, moment, _, homeTemplate) {

	var oldUsers = [
		{
			name: "Vince Lee",
			refreshDateTime: "2015-06-08 12:35",
			regions: ["Starbucks", "Food Counter"],
			closestRegion: "Starbucks",
			regionSignalStrength: 1.5,
			UUID: 123456789
		},
		{
			name: "Chris Gunn",
			refreshDateTime: "2015-06-08 12:35",
			regions: ["Tea Point", "Games Area"],
			closestRegion: "Games Area",
			regionSignalStrength: 2.4,
			UUID: 1234567891
		}
	]


	var newUsers = [
		{
			name: "Vince Lee",
			refreshDateTime: "2015-06-08 12:40",
			regions: ["Food Counter"],
			closestRegion: "Food Counter",
			regionSignalStrength: 1.5,
			UUID: 1234567892
		},
		{
			name: "Raj Eridisinghe",
			refreshDateTime: "2015-06-08 12:40",
			regions: ["Telephone Booth"],
			closestRegion: "Telephone Booth",
			regionSignalStrength: 1.8,
			UUID: 1234567893
		}
	]

	var Region = function(uuid, name, signalStrength) {
		var self = this
		self.UUID = uuid
		self.Name = name
		self.SignalStrength = signalStrength
	}

	var Inhabitant = function(name, refreshDateTime, regions, closestRegion) {
		var self = this
		self.Name = name
		self.RefreshDateTime = moment(refreshDateTime).startOf('minute').fromNow()
		self.Regions = regions // string array
		self.ClosestRegion = closestRegion
	}

  function HomeViewModel(route) {
  	var self = this
  	self.inhabitants = _.map(oldUsers, function(user) {
  		return new Inhabitant(user.name, user.refreshDateTime, user.regions, 
  			new Region(user.UUID, user.closestRegion, user.regionSignalStrength))
  	})

  	self.showElement = function(elem) { console.log("show " + elem); if (elem.nodeType === 1) $(elem).hide().fadeIn("fast") }
    self.hideElement = function(elem) { console.log("hide " + elem); if (elem.nodeType === 1) $(elem).fadeOut("fast", function() { $(elem).remove(); }) }

    self.add = function() {
    	var inhabitants = self.inhabitants()
    	inhabitants.push(new Inhabitant("Mo Mulla", moment()))
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

    self.refresh = function() {
    	
    }
  }


  return { viewModel: HomeViewModel, template: homeTemplate };

});
