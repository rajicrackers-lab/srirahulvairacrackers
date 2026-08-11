import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private datePipe: DatePipe) {
   }
  showFabIcons = new BehaviorSubject<boolean>(true);
  designDetail = new BehaviorSubject<any>({});

  sendWhatsApp(orderInfo:any) {
    let message=`Hi, this is ${orderInfo.name} from ${orderInfo.district}, I recently placed an order for crackers worth ₹${orderInfo.totalAmount} with Sri Rahul Vaira Crackers.`;
    // Encode the message
    const encodedMessage = encodeURIComponent(message);

    // Format the WhatsApp URL
    const whatsappUrl = `https://wa.me/${this.designDetail.value.whatsapp}?text=${encodedMessage}`;
    
    // Open the WhatsApp chat in a new tab
    window.open(whatsappUrl, '_blank');
  }

formateCart(cart: any, language: string) {
  let cartArray: any = [];
  for (let i = 0; i < cart.length; i++) {
      cartArray[i] = [language === 'tamil' ? (cart[i].tamilName ? cart[i].tamilName : cart[i].itemName) : cart[i].itemName, cart[i].mrp ?? 0, cart[i].rate ?? 0, cart[i].qty ?? 0, cart[i].amount ?? 0];
  }
  return cartArray
}

formatDate(dateString: string, showTime: boolean): string {
  // Create a Date object from the string
  const date = new Date(dateString);

  // Format the date using DatePipe
  const formattedDate = this.datePipe.transform(date, showTime ? 'dd/MM/yy, h:mm a' : 'dd/MM/yy');

  return formattedDate || '';
}

layoutSettings={
  showPaidBalance: false,
  storeNameFontSize: 27,
  billSize: 3,
  showEndLine: false,
  showCustomerName: true,
  showGreeting: true,
  showGst: false,
  discountText: "Discount: ",
  showYouSaved: true,
  showAddress: true,
  showMobile: true,
  greetingText: "Happy Diwali!!",
  billLanguage: "english",
  showTime: true
}
basicSettings:any={
  address: this.designDetail.value.address,
  storename: this.designDetail.value.brandText,
  phone: this.designDetail.value.whatsapp,
  gstNo: null,
}

generatePdf(printingBill: any) {
    let layoutSetting=this.layoutSettings;
    this.designDetail.subscribe((res)=>{
      this.basicSettings.address=res.address;
      this.basicSettings.storename=res.brandText;
      this.basicSettings.phone=res.whatsapp;
      this.basicSettings.gstNo=null;
    })
    let basicSetting=this.basicSettings;
    let data = {
        "billSize": layoutSetting.billSize === 2 ? 164.4 : layoutSetting.billSize === 3 ? 226.77 : layoutSetting.billSize === 3 ? 306.14 : 226.77,
        "billLanguage": layoutSetting.billLanguage,
        "shopNameSize": layoutSetting.storeNameFontSize,
        "greetingText": layoutSetting.greetingText,
        "discountText": layoutSetting.discountText,
        "showMobile": layoutSetting.showMobile,
        "showGst": layoutSetting.showGst,
        "showAddress": layoutSetting.showAddress,
        "showCustomerName": layoutSetting.showCustomerName,
        "showTime": layoutSetting.showTime,
        "showEndLine": layoutSetting.showEndLine,
        "showPaidBalance": layoutSetting.showPaidBalance,
        "showYouSaved": layoutSetting.showYouSaved,
        "showGreeting": layoutSetting.showGreeting,
        "shopName": basicSetting.storename,
        "shopAddress": basicSetting.address,
        "shopMobile": basicSetting.phone,
        "shopGst": basicSetting.gstNo,
        "billNo": printingBill.billNo,
        "billDate": this.formatDate(printingBill.date, layoutSetting.showTime),
        "customerName": layoutSetting.billLanguage === 'tamil' ? (printingBill.customerInfo.tamilName ? printingBill.customerInfo.tamilName : printingBill.customerInfo.name) : printingBill.customerInfo.name,
        "cart": this.formateCart(printingBill.cart, layoutSetting.billLanguage),
        "subTotal": printingBill.subTotal,
        "couponAmount": printingBill.couponAmount,
        "total": printingBill.total,
        "paid": printingBill.paid,
        "balance": printingBill.balance,
        "youSaved": printingBill.youSaved
    };

    let dd: any = {
      pageSize: {
          width: data.billSize,
          height: 'auto'
      },
      pageMargins: 5,
      content: [
          {
              columns: [
                  {
                      stack: [
                          {
                              text: data.shopName,
                              fontSize: data.shopNameSize * 0.75,
                              width: '100%',
                              bold: true,
                              alignment: 'center',
                              margin: [0, 2]
                          }
                      ]
                  },

              ]
          },
          {
              columns: [
                  {
                      stack: [
                          {
                              columns: [
                                  {
                                      columns: [
                                          { text: 'Date:', fontSize: 10, width: 'auto' },
                                          { text: data.billDate, fontSize: 9, width: '*', margin: [0, 1, 0, 0] },
                                      ],
                                      width: 'auto',
                                      columnGap: 2,
                                      alignment:'left'
                                  }
                              ],
                              margin: [0, 3]
                          }
                      ]
                  }
              ]

          },
          {
              layout: {
                  hLineWidth: function () {
                      return 0.5;
                  },
                  vLineWidth: function () {
                      return 0;
                  },
                  hLineColor: function () {
                      return '#333333';
                  },
                  paddingTop: function () {
                      return 4;
                  },
                  paddingBottom: function () {
                      return 4;
                  },
                  paddingLeft: function () {
                      return 3;
                  },
                  paddingRight: function () {
                      return 3;
                  }
              },
              table: {
                  headerRows: 1,
                  widths: ['*', 25, 20, 25, 25],
                  body: [
                      [
                          { text: 'Item', bold: true },
                          { text: 'MRP', bold: true },
                          { text: 'Rate', bold: true },
                          { text: 'Qty', bold: true },
                          { text: 'Amt', bold: true }],
                  ]
              },
              margin: [0, 10, 0, 5],
              fontSize: 8
          },
          {
              columns: [
                  {
                      stack: [

                          {
                              columns: [
                                  {
                                      columns: [
                                          { text: 'Total ', fontSize: 10, bold: true },
                                          { text: '(' + data.cart.length + ') :', fontSize: 7, bold: true, width: 'auto', margin: [0, 2, 0, 0] },
                                          { text: '₹' + data.total, fontSize: 10, width: 43, alignment: 'left' },
                                      ],
                                      width: '*',
                                      alignment: 'right',
                                      columnGap: 2,
                                      margin: [0, 3, 0, 3],
                                  }
                              ]
                          }


                      ]
                  }
              ]

          }
      ]
  };
  // Add invoice items dynamically
  for (let i = 0; i < data.cart.length; i++) {
      dd.content[2].table.body.push(data.cart[i]);
  }
  if (data.showAddress) {
      dd.content[0].columns[0].stack.splice(1, 0, {
          text: data.shopAddress,
          width: '100%',
          fontSize: 9,
          alignment: 'center',
          margin: [0, 2]
      });
  }
  if (data.showMobile) {
      dd.content[0].columns[0].stack.splice(2, 0, {
          text: data.shopMobile,
          width: '100%',
          fontSize: 9,
          alignment: 'center',
          margin: [0, 2]
      });
  }
  if (data.showGst) {
      dd.content[0].columns[0].stack[3] = {
          text: 'GSTIN: ' + data.shopGst,
          width: '100%',
          fontSize: 9,
          alignment: 'center',
          margin: [0, 2]
      };
  }
  if (data.showCustomerName && data.customerName) {
      dd.content[1].columns[0].stack.splice(0, 0, {
          columns: [
              {
                  columns: [
                      { text: 'Customer:', fontSize: 10, width: 'auto' },
                      { text: data.customerName, fontSize: 10, width: '*' },
                  ],
                  width: 'auto',
                  alignment: 'left',
                  columnGap: 2,
                  margin: [0, 20, 0, 3]
              }
          ]
      });
  }
  if (data.showPaidBalance) {
      dd.content[3].columns[0].stack.splice(3, 0, {
          columns: [
              {
                  columns: [
                      { text: 'Paid:', fontSize: 10, width: 25 },
                      { text: '₹' + data.paid, fontSize: 10, width: 30 },
                  ],
                  width: 'auto',
                  alignment: 'left',
                  columnGap: 1
              },
              {
                  columns: [
                      { text: 'Balance:', fontSize: 10 },
                      { text: '₹' + data.balance, fontSize: 10, width: 'auto' },
                  ],
                  width: '*',
                  alignment: 'right',
                  columnGap: 1,
              }
          ],
          margin: [10, 5],
      });
  }
  if (data.showEndLine) {
      dd.content[3].columns[0].stack.splice(4, 0, {
          svg: '<svg height="5" width="150"><line x1="0" y1="0" x2="150" y2="0" style="stroke:#333333;stroke-width:.5" /></svg>',
          height: 4,
          alignment: 'center'
      });
  }
  if (data.showYouSaved && data.youSaved>0) {
      dd.content[3].columns[0].stack.splice(5, 0, {
          columns: [
              {
                  text: data.discountText + '₹' + data.youSaved,
                  fontSize: 12,
                  bold: true,
                  alignment: 'center',
              }
          ],
          margin: [0, 10, 0, 5]
      });
  }
  if (data.showGreeting) {
      dd.content[3].columns[0].stack.splice(6, 0, {
          columns: [
              {
                  text: data.greetingText,
                  fontSize: 10,
                  alignment: 'center',
              }
          ],
          margin: [0, 5, 0, 10]
      });
  }
  if (data.subTotal != data.total && data.couponAmount > 0) {
      dd.content[3].columns[0].stack.splice(0, 0, {
          columns: [
              {
                  columns: [
                      { text: 'Sub Total :', fontSize: 10, bold: true },
                      { text: '₹' + data.subTotal, fontSize: 10, width: 43, alignment: 'left' },
                  ],
                  width: '*',
                  alignment: 'right',
                  columnGap: 2,
                  margin: [0, 3, 0, 3]
              }
          ]
      });
      dd.content[3].columns[0].stack.splice(1, 0, {
          columns: [
              {
                  columns: [
                      { text: 'Coupon Discount :', fontSize: 10, bold: true },
                      { text: '-₹' + data.couponAmount, fontSize: 10, width: 43, alignment: 'left' },
                  ],
                  width: '*',
                  alignment: 'right',
                  columnGap: 2,
                  margin: [0, 3, 0, 3]
              }
          ]
      });
  }
  return pdfMake.createPdf(dd);
}

}
