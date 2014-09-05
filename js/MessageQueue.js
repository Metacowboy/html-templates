// defines a page with it's text and a flag if it should be stretched
function Page(text, noStretch) {
	this.text = text || '';
	this.noStretch = noStretch || false;
}


// A message is an object holding pages and allows easy access
function Message(pages) {
	this.pages = pages;
	this.index = 0;
}

// Returns a clone of this Message
Message.prototype.clone = function() {
	return new Message(this.pages);
};

// returns whether or not there is a next page in this message
Message.prototype.hasNext = function() {
	return this.pages && this.index < this.pages.length;
};

// returns the next page or null if there is no nextPage
Message.prototype.nextPage = function() {
	if (this.hasNext()) {
		i = this.index;
		this.index = this.index + 1;
		return this.pages[i];
	}
	return null;
};

// restarts the iterator over the pages of this message
Message.prototype.restart = function() {
	this.index = 0;
};


// A MessageQueue allows to bundle messages in a queue so you can retrieve them
// and update them easily
function MessageQueue(messages) {
	this.updates = [];
	this.messages = [];
	if (messages) {
		this.update(messages, true);
	} 
	this.current = null;
}

MessageQueue.prototype.clear = function(forceImmediate) {
	this.updates.length = 0;
	this.messages.length = 0;
	if (forceImmediate) {
		this.current = null;
	}
};

MessageQueue.prototype.isEmpty = function() {
	return ((!this.updates || this.updates.length === 0) && (!this.messages || this.messages.length === 0) && (!this.current || !this.current.hasNext)); 
};

// Updates the messages in this queue. If forceImmediate is true,
// the old queue will be removed and the new messages will by in the queue
// immediately. Never the less, the nextPage() function will finish the current
// message! So currently showed messages are not interrupted.
MessageQueue.prototype.update = function(messages, forceImmediate) {
	this.updates = messages;
	if (forceImmediate) {
		this.restart();
	}
};

// Add a message at the end of the next queue cycle or,
// if forceImmediate is true, at the end of the queue.
MessageQueue.prototype.addMessage = function(message, forceImmediate) {
	this.updates.push(message);
	if (forceImmediate) {
		this.messages.push(message.clone());
	}
};

// Restarts the queue. If an update has been made,
// this will drop the messages in the queue and process
// the update what is equal to an update with forceImmediate = true
MessageQueue.prototype.restart = function() {
		this.messages = [];
		for (m in this.updates) {
			this.messages.push(this.updates[m].clone());		
		}
};

// Returns the current message or null if there is no message inside this queue
MessageQueue.prototype.currentMessage = function() {
	if (!this.current) {
		// no current, check the messages for a next
		if (!this.messages || this.messages.length <= 0) {
			// No (more) messages, so check the updates
			if (!this.updates || this.updates.length <= 0) {
				// no way, there is nothing in this queue to return
				return null;
			} else {
				this.restart();
			}
		}
		this.current = this.messages.shift();
	}
	return this.current;
};

// returns the next page in this queue (which may be empty, but not null)
MessageQueue.prototype.nextPage = function() {
	if (this.currentMessage()) { 
		if (this.currentMessage().hasNext()) {
			return this.currentMessage().nextPage();
		} else {
			this.current = null;
			return this.nextPage();
		}
	}
	return new Page("",true);
};