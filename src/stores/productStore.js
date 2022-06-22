import { AuthStore } from './authStore';
import { inject } from 'aurelia-framework';
import Store from './store';

export const EVENTS = {
  FETCH_SUITES : 'product_store:fetch_suites'
};

const PRODUCT_SUITES = [
  { sku: 'PT0106', name: 'Forecaster - Service Provider Markets Global', products: [
    { name: 'Service Provider Markets', rank: 1.0 }
  ] },
  { sku: 'PT0107', name: 'Forecaster - World Cellular Information Service', products: [
    { name: 'World Cellular Information Service', rank: 2.0 }
  ] },
  { sku: 'PT0108', name: 'Forecaster - World Broadband Information Service', products: [
    { name: 'World Broadband Information Service', rank: 2.1 }
  ] },
  { sku: 'PT0109', name: 'Forecaster - World TV Information Service', products: [
    { name: 'World TV Information Service', rank: 2.2 }
  ] },
  { sku: 'PT0110', name: 'Forecaster - Suite', products: [
    { name: 'Service Provider Markets', rank: 1.0 },
    { name: 'Consumer and Entertainment Services', rank: 3.0 },
    { name: 'Enterprise Services', rank: 4.0 },
    { name: 'Service Provider Technology', rank: 5.0 },
    { name: 'IT Markets', rank: 6.0 },
    { name: 'Enterprise Verticals', rank: 7.0 },
    { name: 'Internet of Things', rank: 8.0 }
  ] },
  { sku: 'PT0111', name: 'Forecaster - Suite Americas', products: [
    { name: 'Service Provider Markets Americas', rank: 1.0 },
    { name: 'Consumer and Entertainment Services Americas', rank: 3.0 },
    { name: 'Enterprise Services Americas', rank: 4.0 },
    { name: 'Service Provider Technology Americas', rank: 5.0 },
    { name: 'IT Markets Americas', rank: 6.0 },
    { name: 'Enterprise Verticals', rank: 7.0 },
    { name: 'Internet of Things Americas', rank: 8.0 }
  ] },
  { sku: 'PT0112', name: 'Forecaster - Suite Asia', products: [
    { name: 'Service Provider Markets Asia', rank: 1.0 },
    { name: 'Consumer and Entertainment Services Asia', rank: 3.0 },
    { name: 'Enterprise Services Asia', rank: 4.0 },
    { name: 'Service Provider Technology Asia', rank: 5.0 },
    { name: 'IT Markets Asia', rank: 6.0 },
    { name: 'Enterprise Verticals', rank: 7.0 },
    { name: 'Internet of Things Asia', rank: 8.0 }
  ] },
  { sku: 'PT0113', name: 'Forecaster - Suite Europe', products: [
    { name: 'Service Provider Markets Europe', rank: 1.0 },
    { name: 'Consumer and Entertainment Services Europe', rank: 3.0 },
    { name: 'Enterprise Services Europe', rank: 4.0 },
    { name: 'Service Provider Technology Europe', rank: 5.0 },
    { name: 'IT Markets Europe', rank: 6.0 },
    { name: 'Enterprise Verticals', rank: 7.0 },
    { name: 'Internet of Things Europe', rank: 8.0 }
  ] },
  { sku: 'PT0114', name: 'Forecaster - Suite Middle East and Africa', products: [
    { name: 'Service Provider Markets Middle East and Africa', rank: 1.0 },
    { name: 'Consumer and Entertainment Services Middle East and Africa', rank: 3.0 },
    { name: 'Enterprise Services Middle East and Africa', rank: 4.0 },
    { name: 'Service Provider Technology Middle East and Africa', rank: 5.0 },
    { name: 'IT Markets Middle East and Africa', rank: 6.0 },
    { name: 'Enterprise Verticals', rank: 7.0 },
    { name: 'Internet of Things Middle East and Africa', rank: 8.0 }
  ] },
  { sku: 'PT0115', name: 'Forecaster - Service Provider Technology', products: [
    { name: 'Service Provider Technology', rank: 5.0 }
  ] },
  { sku: 'PT0116', name: 'Forecaster - Service Provider Markets Americas', products: [
    { name: 'Service Provider Markets Americas', rank: 1.0 }
  ] },
  { sku: 'PT0117', name: 'Forecaster - Service Provider Markets Asia', products: [
    { name: 'Service Provider Markets Asia', rank: 1.0 }
  ] },
  { sku: 'PT0118', name: 'Forecaster - Service Provider Markets Europe', products: [
    { name: 'Service Provider Markets Europe', rank: 1.0 }
  ] },
  { sku: 'PT0119', name: 'Forecaster - Service Provider Markets Middle East and Africa', products: [
    { name: 'Service Provider Markets Middle East and Africa', rank: 1.0 }
  ] },
  { sku: 'PT0120', name: 'Forecaster - Consumer and Entertainment Services', products: [
    { name: 'Consumer and Entertainment Services', rank: 3.0 }
  ] },
  { sku: 'PT0121', name: 'Forecaster - Enterprise Services', products: [
    { name: 'Enterprise Services', rank: 4.0 }
  ] },
  { sku: 'PT0123', name: 'Forecaster - IT Markets', products: [
    { name: 'IT Markets', rank: 6.0 }
  ] },
  { sku: 'PT0135', name: 'Enterprise Verticals', products: [
    { name: 'Enterprise Verticals', rank: 7.0 }
  ] },
  { sku: 'PT0122', name: 'Forecaster - Internet of Things', products: [
    { name: 'Internet of Things', rank: 8.0 }
  ] },
  {
    sku: 'SPWCISSS', name: 'SPWCISSS', products: [
      { name: 'World Cellular Information Series', rank: 1.0 }
    ]
  },
  {
    sku: 'SPWBISSS', name: 'SPWBISSS', products: [
      { name: 'World Broadband Information Series', rank: 1.0 }
    ]
  },
  {
    sku: 'MEWTVISSS', name: 'MEWTVISSS', products: [
      { name: 'World TV Information Series', rank: 1.0 }
    ]
  }
];

const getSuitesBySku = (sku) =>
  PRODUCT_SUITES.filter(suite => -1 < sku.indexOf(suite.sku));

@inject(AuthStore)
export class ProductStore extends Store {

  constructor(authStore, ...rest) {
    super(...rest);

    this.user = authStore.data.user;
    this.data = {
      isLoading : false,
      suites    : Array.isArray(this.user.products)
        ? getSuitesBySku(this.user.products.map(product => product.id))
        : []
    };
  }

  get EVENTS() {
    return [
      EVENTS.FETCH_SUITES
    ];
  }

  fetchProducts() {
    this.refresh({
      isLoading : false,
      suites    : Array.isArray(this.user.products)
        ? getSuitesBySku(this.user.products.map(product => product.id))
        : []
    });
  }

  getDefaultState() {
    return this.data;
  };

  name = () => 'products';

  onEvent(data, event) {
    switch (event) {
      case EVENTS.FETCH_SUITES:
        this.fetchProducts();
        break;
    }
  }
}
