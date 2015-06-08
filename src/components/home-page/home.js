define(["knockout", "jquery", "moment", "lodash", "text!./home.html"],
	   function(ko, $, moment, _, homeTemplate) {

	var Region = function(uuid, name, signalStrength) {
		var self = this
		self.UUID = uuid
		self.Name = name
		self.SignalStrength = signalStrength
	}

	var Inhabitant = function(name, refreshDateTime, regions, closestRegion, isConnected) {
		var self = this
		self.Name = name
		self.EnteredParkAt = moment(refreshDateTime)
		self.EnteredAreaDateTime = moment(refreshDateTime).startOf('minute').fromNow()
		self.RefreshDateTime = moment(refreshDateTime).startOf('minute').fromNow()
		self.Regions = regions // string array
		self.ClosestRegion = closestRegion
		self.IsConnected = isConnected
	}

  function HomeViewModel(route) {
  	var self = this
  	self.inhabitants = ko.observableArray()

  	self.showElement = function(elem) { if (elem.nodeType === 1) $(elem).hide().slideDown("slow") }
    self.hideElement = function(elem) { if (elem.nodeType === 1) $(elem).slideUp("slow", function() { $(elem).remove(); }) }

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
    		return match !== undefined && match.ConnectionStatus === "Connected"
    	})

    	_.forEach(toKeep, function(u) {
    		var match = _.find(newData, { 'name': u.Name })
    		u.ClosestRegion = new Region(match.UUID, match.closestRegion, match.signalStrength)
    	})

    	self.inhabitants(toKeep)

    	// add
    	var toAdd = _.filter(newData, function(o) {
    		var match = _.find(self.inhabitants(), { 'Name': o.name })
    		return match === undefined && o.ConnectionStatus === "Connected"
    	})
    	_.forEach(toAdd, function(a) {
    		var curr = self.inhabitants()
    		curr.unshift(new Inhabitant(a.name, a.refreshDateTime, a.regions, 
    			new Region(a.UUID, a.closestRegion, a.SignalStrength),
    			a.ConnectionStatus === "Connected"))
    		self.inhabitants(curr)
    	})
    	var sorted = _.sortBy(self.inhabitants(), function(i) {
    		return -(i.EnteredParkAt)
    	})
    	self.inhabitants(sorted)

    	self.updateTotalInhabitants('FoodCounter', 		'food-counter', 	'120, 0, 40')
    	self.updateTotalInhabitants('Starbucks', 		'starbucks', 		'255, 120, 0')
    	self.updateTotalInhabitants('TeaPoint', 		'tea-point', 		'120, 0, 40')
    	self.updateTotalInhabitants('GamesArea', 		'games-area', 		'0, 200, 40')
    	self.updateTotalInhabitants('TelephoneBooth', 	'telephone-booth', 	'0, 100, 140')
    }

    self.updateTotalInhabitants = function(apiID, htmlID, rgbValue) {
    	var totalInFoodCounter = _.filter(self.inhabitants(), function(i) {
    		return i.ClosestRegion.Name === apiID
    	}).length
    	$("div#" + htmlID).css('background-color', 'rgba(' + rgbValue + ', ' + totalInFoodCounter / 10 + ')')    	
    }

    self.pollData = function() {
    	$.get( "http://parklifeservices.apphb.com/api/getall", function( data ) {
    		var json = JSON.parse(data)

    		var mapped = _.map(json, function(u) {
		    	return {
					name: u.UserName,
					refreshDateTime: u.ClosestRegion.TakenAt,
					regions: _.map(u.VisibleRegions, function(r) {
						return r.Id
					}),
					closestRegion: u.ClosestRegion.Id,
					regionSignalStrength: 1.5,
					UUID: 1234567892,
					ConnectionStatus: u.Status
    			}
    		})

    		self.refresh(mapped)
		});
    }

    self.pollData
    var interval = setInterval(self.pollData, 2000)
  }


  return { viewModel: HomeViewModel, template: homeTemplate };

});
