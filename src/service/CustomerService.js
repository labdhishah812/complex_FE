// import axios from 'axios';

// export class CustomerService {
//     getCustomersMedium() {
//         return axios.get('assets/demo/data/customers-medium.json').then((res) => res.data.data);
//     }

//     getCustomersLarge() {
//         return axios.get('assets/demo/data/customers-large.json').then((res) => res.data.data);
//     }
// }
export const CustomersService = {
    getData() {
      return [
        {
            storecoad:'Store #0001',
            chain:'Reliance',
            zone:'North',
            city:'Surat',
            state:'Gujarat',
            storename:'Store1',
            location:'Location',
        },
        {
            storecoad:'Store #0001',
            chain:'Reliance',
            zone:'North',
            city:'Surat',
            state:'Gujarat',
            storename:'Store1',
            location:'Location',
        },
        {
            storecoad:'Store #0001',
            chain:'Reliance',
            zone:'North',
            city:'Surat',
            state:'Gujarat',
            storename:'Store1',
            location:'Location',
        },
        {
            storecoad:'Store #0001',
            chain:'Reliance',
            zone:'North',
            city:'Surat',
            state:'Gujarat',
            storename:'Store1',
            location:'Location',
        },
        {
            storecoad:'Store #0001',
            chain:'Reliance',
            zone:'North',
            city:'Surat',
            state:'Gujarat',
            storename:'Store1',
            location:'Location',
        },
        {},
        {},
        {},
        {},
        {},
        {},
      ];
    },
    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
      },
    
      getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
      },
    
      getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
      },
    
      getCustomersXLarge() {
        return Promise.resolve(this.getData());
      },
    
      getCustomers(params) {
        const queryParams = params
          ? Object.keys(params)
              .map(
                (k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
              )
              .join('&')
          : '';
    
        return fetch(
          'https://www.primefaces.org/data/customers?' + queryParams
        ).then((res) => res.json());
      },
}