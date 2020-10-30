import React from "react";
import { Autocomplete, PlaceResult } from "../../Types/google.maps";
import {
  componentForm,
  getAutoCompleteResult,
} from "./Utils/getAutoCompleteResult";
import { loadScript } from "./Utils/loadScript";

export type TAddressType = keyof typeof componentForm;

export interface IPartialAutocompleteResult {
  street_number: string | null;
  route: string | null;
  locality: string | null;
  administrative_area_level_1: string | null;
  country: string | null;
  postal_code: string | null;
}

interface IAutocompleteResult extends IPartialAutocompleteResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

interface IAutocompleteAddressState {
  autoCompleteFieldValue: string;
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
    };
  }

  public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const lat = place.geometry ? place.geometry.location.lat() : 0;
      const lng = place.geometry ? place.geometry.location.lng() : 0;

      const partialAutoCompleteResult = getAutoCompleteResult(place);

      this.setState({
        autoCompleteFieldValue: place.formatted_address,
        autocompleteResult: {
          ...partialAutoCompleteResult,
          lat,
          lng,
          formattedAddress: place.formatted_address,
        },
      });
    }
  };

  componentWillMount(): void {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`,
      () => {
        this.initAutocomplete();
      }
    );
  }

  public render(): JSX.Element {
    const { autocompleteResult, autoCompleteFieldValue } = this.state;

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
                      value={autocompleteResult.lat || ""}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="control-label">Longitude</label>
                    <input
                      className="form-control"
                      id="longitude"
                      disabled={true}
                      value={autocompleteResult.lng || ""}
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
