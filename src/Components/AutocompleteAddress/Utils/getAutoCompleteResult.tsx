import {
  GeocoderAddressComponent,
  PlaceResult,
} from "../../../Types/google.maps";

import {
  IPartialAutocompleteResult,
  TAddressType,
} from "../AutocompleteAddress";

export const componentForm: IPartialAutocompleteResult = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  country: "long_name",
  postal_code: "short_name",
};

const initialAutocompleteResult = {
  street_number: null,
  route: null,
  locality: null,
  administrative_area_level_1: null,
  country: null,
  postal_code: null,
};

export const getAutoCompleteResult = (place: PlaceResult) =>
  (place.address_components || []).reduce(
    (acc: IPartialAutocompleteResult, addressComponent) => {
      const addressType: TAddressType = addressComponent.types[0] as any;

      const addressAccessor = componentForm[
        addressType
      ] as keyof GeocoderAddressComponent;

      return addressAccessor
        ? { ...acc, [addressType]: addressComponent[addressAccessor] }
        : acc;
    },
    initialAutocompleteResult
  );
