export type SearchType = {
  city: string;
  country: string;
};
export type Countries = {
  code: string;
  name: string;
};

export type Weather = {
  name: string;
  main: {
    temp: string;
    temp_min: number;
    temp_max: number;
  };
};
