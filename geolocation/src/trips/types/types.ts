interface GoogleMapsStep {
  html_instructions: string;
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  durationInTraffic: string;
  polyline: {
    points: string;
  };
}
