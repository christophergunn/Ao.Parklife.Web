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
			refreshDateTime: moment(),
			regions: ["Food Counter"],
			closestRegion: "Food Counter",
			regionSignalStrength: 1.5,
			UUID: 1234567892
		},
		{
			name: "Raj Eridisinghe",
			refreshDateTime: moment(),
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
		self.EnteredParkAt = moment(refreshDateTime)
		self.EnteredAreaDateTime = moment(refreshDateTime).startOf('minute').fromNow()
		self.RefreshDateTime = moment(refreshDateTime).startOf('minute').fromNow()
		self.Regions = regions // string array
		self.ClosestRegion = closestRegion
	}

  function HomeViewModel(route) {
  	var self = this
  	self.inhabitants = ko.observableArray(_.map(oldUsers, function(user) {
  		return new Inhabitant(user.name, user.refreshDateTime, user.regions, 
  			new Region(user.UUID, user.closestRegion, user.regionSignalStrength))
  	}))

  	self.showElement = function(elem) { console.log("show " + elem); if (elem.nodeType === 1) $(elem).hide().slideDown("slow") }
    self.hideElement = function(elem) { console.log("hide " + elem); if (elem.nodeType === 1) $(elem).slideUp("slow", function() { $(elem).remove(); }) }

    self.remove = function(row, event) {
    	var inhabitants = _.filter(self.inhabitants(), function(x) {
    		return x.Name !== row.Name
    	})
    	self.inhabitants(inhabitants) 
    }

    self.refresh = function(newData) {
    	if(!_.isArray(newData)) { newData = newUsers }
    	// remove people no longer in feed
    	var toKeep = _.filter(self.inhabitants(), function(o) {
    		var match = _.find(newData, { 'name': o.Name })
    		return match !== undefined
    	})

    	self.inhabitants(toKeep)


    	// add
    	var toAdd = _.filter(newData, function(o) {
    		var match = _.find(self.inhabitants(), { 'Name': o.name })
    		return match === undefined
    	})
    	_.forEach(toAdd, function(a) {
    		var curr = self.inhabitants()
    		curr.unshift(new Inhabitant(a.name, a.refreshDateTime, a.regions, 
    			new Region(a.UUID, a.Name, a.SignalStrength)))
    		self.inhabitants(curr)
    	})
    	var sorted = _.sortBy(self.inhabitants(), function(i) {
    		return -(i.EnteredParkAt)
    	})
    	self.inhabitants(sorted)
    }

    self.pollData = function() {
    	$.get( "http://localhost:51846/api/DummyGetAll", function( data ) {
    		var json = JSON.parse(data)
    		console.log(json)

    		var mapped = _.map(json, function(u) {
		    	return {
					name: u.UserName,
					refreshDateTime: u.ClosestBeacon.LatestReading.TakenAt,
					regions: ["Food Counter"],
					closestRegion: u.ClosestRegion.Id,
					regionSignalStrength: 1.5,
					UUID: 1234567892
    			}
    		})

    		self.refresh(mapped)
		});
    }

    var interval = setInterval(self.pollData, 2000)
  }


  return { viewModel: HomeViewModel, template: homeTemplate };

});
