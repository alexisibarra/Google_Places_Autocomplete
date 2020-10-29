import {
  GeocoderAddressComponent,
  PlaceResult,
} from "../../../Types/google.maps";

import {
  IAutocompleteResult,
  TAddressType,
  componentForm,
  initialAutocompleteResult,
} from "../AutocompleteAddress";

export const getAutoCompleteResult = (place: PlaceResult) =>
  (place.address_components || []).reduce(
    (acc: IAutocompleteResult, addressComponent) => {
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
