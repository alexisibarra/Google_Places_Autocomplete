import React from "react";
import { Autocomplete, PlaceResult } from "../../Types/google.maps";
import { getAutoCompleteResult } from "./Utils/getAutoCompleteResult";
import { loadScript } from "./Utils/loadScript";

export type TAddressType = keyof typeof componentForm;

export interface IAutocompleteResult {
  street_number: string | null;
  route: string | null;
  locality: string | null;
  administrative_area_level_1: string | null;
  country: string | null;
  postal_code: string | null;
}

export const initialAutocompleteResult = {
  street_number: null,
  route: null,
  locality: null,
  administrative_area_level_1: null,
  country: null,
  postal_code: null,
};

export const componentForm: IAutocompleteResult = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  country: "long_name",
  postal_code: "short_name",
};

interface IAutocompleteAddressState {
  autoCompleteFieldValue: string;
  lat: number;
  lng: number;
  autocomplete?: Autocomplete;
  autocompleteResult?: IAutocompleteResult;
}

export class AutocompleteAddress extends React.Component<
  {},
  IAutocompleteAddressState
> {
  public autocompleteRef = React.createRef<HTMLInputElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      autoCompleteFieldValue: "",
      lat: 0,
      lng: 0,
    };
  }

  public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.autoCompleteFieldValue.length > 5) {
      this.initAutocomplete();
    }

    this.setState({ autoCompleteFieldValue: e.target.value });
  };

  // Google API Autofill
  public initAutocomplete = () => {
    const autocomplete: Autocomplete = new (window as any).google.maps.places.Autocomplete(
      this.autocompleteRef.current,
      { types: ["geocode"], componentRestrictions: { country: "us" } }
    );

    autocomplete.addListener("place_changed", this.fillInAddress);

    this.setState({ autocomplete });
  };

  // Triggers when a user selects an address
  public fillInAddress = () => {
    const place: PlaceResult | null = this.state.autocomplete
      ? this.state.autocomplete.getPlace()
      : null;

    if (place) {
      if (place.geometry) {
        this.setState({ lat: place.geometry.location.lat() });
        this.setState({ lng: place.geometry.location.lng() });
      }

      this.setState({ autocompleteResult: getAutoCompleteResult(place) });
    }
  };

  componentWillMount(): void {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`
    );
  }

  public render(): JSX.Element {
    const { autocompleteResult, autoCompleteFieldValue, lat, lng } = this.state;

    return (
      <div className="container" style={{ marginTop: "15px" }}>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">Address</h3>
          </div>
          <div className="panel-body">
            <input
              ref={this.autocompleteRef}
              placeholder="Enter your address"
              type="text"
              className="form-control"
              onChange={this.onInputChange}
              value={autoCompleteFieldValue}
            />
            <br />
            {autocompleteResult && (
              <div id="address">
                <div className="row">
                  <div className="col-md-6">
                    <label className="control-label">Street address</label>
                    <input
                      className="form-control"
                      id="street_number"
                      value={autocompleteResult.street_number || ""}
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="control-label">Route</label>
                    <input
                      className="form-control"
                      id="route"
                      value={autocompleteResult.route || ""}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="control-label">City</label>
                    <input
                      className="form-control field"
                      id="locality"
                      value={autocompleteResult.locality || ""}
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="control-label">State</label>
                    <input
                      className="form-control"
                      id="administrative_area_level_1"
                      value={
                        autocompleteResult.administrative_area_level_1 || ""
                      }
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="control-label">Zip code</label>
                    <input
                      className="form-control"
                      id="postal_code"
                      value={autocompleteResult.postal_code || ""}
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="control-label">Country</label>
                    <input
                      className="form-control"
                      id="country"
                      value={autocompleteResult.country || ""}
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="control-label">Latitude</label>
                    <input
                      className="form-control"
                      id="latitude"
                      disabled={true}
                      value={lat}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="control-label">Longitude</label>
                    <input
                      className="form-control"
                      id="longitude"
                      disabled={true}
                      value={lng}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
