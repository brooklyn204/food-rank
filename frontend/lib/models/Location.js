class Location {
  constructor( name, websiteURL = '', votes = 0 ) {
    this.name = name;
    this.websiteURL = websiteURL;
    this.votes = votes;
  }
}

export default Location;