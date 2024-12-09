import { Currency } from "@htkradass/common";
import { ProductOptionTypes } from "../product/product.utils";

export enum InOrderProcessStatus {
  IN_CART = 'IN-CART',
  IN_ORDER = 'IN-ORDER',
  IN_PROCESS = 'IN-PROCESSING',
  DONE = 'DONE',
  ARCHIVE = 'ARCHIVE'
}

export class OrderUtils {
  static isAnOrderLineAvailable(orderLineChoiceKey: string, fullSetProductChoiceKey: string): boolean {
    if (!orderLineChoiceKey || !fullSetProductChoiceKey) return false;

    const orderLineChoices = orderLineChoiceKey.split(';');
    const fullSetProductChoices = fullSetProductChoiceKey.split(';');

    for (let i = 0; i < orderLineChoices.length; i++) {
      const orderLineChoice = orderLineChoices[i];
      const foundIndex = fullSetProductChoices.findIndex(ch => ch == orderLineChoice);
      if (foundIndex < 0) {
        return false;
      }
    };

    return true;
  }

  static compareOrderLineWithChoiceKey(orderLine: { productId: string, basePrice: object, options: [object?] }, choiceKey: string): boolean {
    const productChoiceKeys = choiceKey.split(';');

    // Check product
    if (orderLine?.productId == undefined || orderLine?.productId == null) return false;
    const productChoiceKey = this.buildOrderLineKeys().ofProduct(orderLine.productId);
    const productMatchedIndex: number = productChoiceKeys.findIndex((key) => productChoiceKey == key);
    if (productMatchedIndex < 0) return false;
    productChoiceKeys.splice(productMatchedIndex, 1);


    // Check base price
    if (orderLine?.basePrice == undefined || orderLine?.basePrice == null) return false;
    const basePriceChoiceKey = this.buildOrderLineKeys().ofBasePrice(orderLine.basePrice);
    const basePriceMatchedIndex: number = productChoiceKeys.findIndex((key) => basePriceChoiceKey == key);
    if (basePriceMatchedIndex < 0) return false;
    productChoiceKeys.splice(basePriceMatchedIndex, 1);


    // Check opts
    if (orderLine.options?.length > 0) {
      for (let i = 0; i < orderLine.options.length; i++) {
        const opt = orderLine.options[i];
        if (opt['type'] == ProductOptionTypes.SINGLE) {
          const singleOptChoiceKey = this.buildOrderLineKeys().ofOptions(opt).single(opt['choice']);
          const singleOptMatchedIndex: number = productChoiceKeys.findIndex((key) => singleOptChoiceKey == key);
          if (singleOptMatchedIndex < 0) return false;
          productChoiceKeys.splice(singleOptMatchedIndex, 1);
        } else if (opt['type'] == ProductOptionTypes.MULTIPLE) {

          const choices = opt['choices'];
          for (let j = 0; j < choices.length; j++) {
            const choice = choices[j];
            const mulipleOptChoiceKey = this.buildOrderLineKeys().ofOptions(opt).multiple(choice);
            const mulitpleOptMatchedIndex: number = productChoiceKeys.findIndex((key) => mulipleOptChoiceKey == key);

            if (mulitpleOptMatchedIndex < 0) return false;
            productChoiceKeys.splice(mulitpleOptMatchedIndex, 1);
          }
        } else if (opt['type'] == ProductOptionTypes.QUANTITY) {
          const choices = opt['choices'];
          for (let j = 0; j < choices.length; j++) {
            const choice = choices[j];
            const quantityOptChoiceKey = this.buildOrderLineKeys().ofOptions(opt).quantity(choice);
            const quantityOptMatchedIndex: number = productChoiceKeys.findIndex((key) => quantityOptChoiceKey == key);
            if (quantityOptMatchedIndex < 0) return false;
            productChoiceKeys.splice(quantityOptMatchedIndex, 1);
          }
        }
      }
    }

    // Remaining unmatched choices
    if (productChoiceKeys.length > 0) return false;

    return true;
  }

  // Generate product choice into a string key
  static generateOrderLineChoiceKey(productId: string, basePrice: object, options: [object?], configOpt = { hasQty: true }): string {
    let str = "";

    // Concate product ID
    if (productId) {
      str += this.buildOrderLineKeys().ofProduct(productId);
    }

    // Concate basePrice
    if (basePrice != null) {
      str += ";";
      str += this.buildOrderLineKeys().ofBasePrice(basePrice);
    }

    // Concate options
    if (options?.length > 0) {
      let optChoiceKeys = "";
      options.forEach(opt => {
        if (opt['type'] == ProductOptionTypes.SINGLE) {
          optChoiceKeys += ";";
          optChoiceKeys += this.buildOrderLineKeys().ofOptions(opt).single(opt['choice']);
        } else if (opt['type'] == ProductOptionTypes.MULTIPLE) {
          const choices: object[] = opt['choices'];
          choices.forEach(choice => {
            optChoiceKeys += ";";
            optChoiceKeys += this.buildOrderLineKeys().ofOptions(opt).multiple(choice);
          });
        } else if (opt['type'] == ProductOptionTypes.QUANTITY) {
          const choices: object[] = opt['choices'];
          choices.forEach(choice => {
            optChoiceKeys += ";";
            optChoiceKeys += this.buildOrderLineKeys().ofOptions(opt).quantity(choice, { hasQty: configOpt.hasQty });
          });
        }
      });

      str += optChoiceKeys;
    }

    return str;
  }

  // Generate product choice into a string key
  static generateFullSetProductChoiceKey(productId: string, prices: [object?], options: [object?]): string {
    let str = "";

    // Concate product ID
    if (productId) {
      str += this.buildOrderLineKeys().ofProduct(productId);
    }

    // Concate basePrice
    if (prices?.length > 0) {
      prices.forEach(price => {
        str += ";";
        str += this.buildOrderLineKeys().ofBasePrice(price);
      });
    }

    // Concate options
    if (options?.length > 0) {
      let optChoiceKeys = "";
      options.forEach(opt => {
        if (opt['type'] == ProductOptionTypes.SINGLE) {
          const choices: object[] = opt['choices'];
          choices.forEach(choice => {
            optChoiceKeys += ";";
            optChoiceKeys += this.buildOrderLineKeys().ofOptions(opt).single(choice);;
          });
        } else if (opt['type'] == ProductOptionTypes.MULTIPLE) {
          const choices: object[] = opt['choices'];
          choices.forEach(choice => {
            optChoiceKeys += ";";
            optChoiceKeys += this.buildOrderLineKeys().ofOptions(opt).multiple(choice);
          });
        } else if (opt['type'] == ProductOptionTypes.QUANTITY) {
          const choices: object[] = opt['choices'];
          choices.forEach(choice => {
            optChoiceKeys += ";";
            optChoiceKeys += this.buildOrderLineKeys().ofOptions(opt).quantity(choice, { hasQty: false });
          });
        }
      });

      str += optChoiceKeys;
    }

    return str;
  }

  // Generate product choice into a string key
  static generateOrderLineOptionShortDesc(productId: string, basePrice: object, options: [object?]): string {
    let str = "";

    // Concate options
    if (options?.length > 0) {
      let optChoiceKeys = "";
      options.forEach((opt, index) => {
        if (opt['type'] == ProductOptionTypes.SINGLE) {
          optChoiceKeys += this.buildOrderLineOptionShortDescs().ofOptions(opt).single();
        } else if (opt['type'] == ProductOptionTypes.MULTIPLE) {
          const choices: object[] = opt['choices'];
          optChoiceKeys += this.buildOrderLineOptionShortDescs().ofOptions(opt).multiple(choices);
        } else if (opt['type'] == ProductOptionTypes.QUANTITY) {
          const choices: object[] = opt['choices'];
          optChoiceKeys += this.buildOrderLineOptionShortDescs().ofOptions(opt).quantity(choices);
        }

        if (options[index + 1] !== undefined) {
          optChoiceKeys += "; ";
        }
      });

      str += optChoiceKeys;
    }

    return str;
  }

  static tranformOrderLinesToSummerizedOrderLines(orderLines: object[]) {
    const tranformedOrderLines = [];

    for (let i = 0; i < orderLines.length; i++) {
      let orderLine = orderLines[i];
      delete orderLine['clonedOptions'];
      orderLine['clonedProduct'] = {
        id: orderLine['clonedProduct']["id"],
        name: orderLine['clonedProduct']["name"],
      }

      tranformedOrderLines.push(orderLine);
    }

    return tranformedOrderLines;
  }

  // Utils
  private static buildOrderLineKeys() {
    return {
      ofProduct: (productId: string): string => "PRODUCT[" + productId + "]",
      ofBasePrice: (basePrice: object): string => {
        let basePriceChoiceKey = "";
        basePriceChoiceKey += "BASE_PRICE[";
        basePriceChoiceKey += basePrice['id'];
        basePriceChoiceKey += ",";
        basePriceChoiceKey += encodeURI(basePrice['name']);
        basePriceChoiceKey += ",";
        basePriceChoiceKey += basePrice['price'];
        basePriceChoiceKey += ",";
        basePriceChoiceKey += Currency[basePrice['currency']].symbol;
        if (basePrice?.['hasDiscount'] == true) {
          basePriceChoiceKey += ",";
          basePriceChoiceKey += basePrice['discountPrice'];
        }
        basePriceChoiceKey += "]";

        return basePriceChoiceKey;
      },
      ofOptions: (option: object) => {
        let preOptChoiceKey = "";
        preOptChoiceKey += option['id'];
        preOptChoiceKey += ",";
        preOptChoiceKey += option['type'];
        preOptChoiceKey += ",";
        preOptChoiceKey += encodeURI(option['name']);
        return {
          single: (choice: object): string => {
            let optChoiceKey = "";
            optChoiceKey += "SINGLE_OPTION[";
            optChoiceKey += preOptChoiceKey;
            optChoiceKey += ",";
            optChoiceKey += choice['id'];
            optChoiceKey += ",";
            optChoiceKey += encodeURI(choice['name']);
            optChoiceKey += ",";
            optChoiceKey += choice['price'];
            optChoiceKey += ",";
            optChoiceKey += Currency[choice['currency']].symbol;
            optChoiceKey += "]";
            return optChoiceKey;
          },
          multiple: (choice: object): string => {
            let optChoiceKey = "";
            optChoiceKey += "MULTIPLE_OPTION[";
            optChoiceKey += preOptChoiceKey;
            optChoiceKey += ",";
            optChoiceKey += choice['id'];
            optChoiceKey += ",";
            optChoiceKey += encodeURI(choice['name']);
            optChoiceKey += ",";
            optChoiceKey += choice['price'];
            optChoiceKey += ",";
            optChoiceKey += Currency[choice['currency']].symbol;

            optChoiceKey += "]";
            return optChoiceKey;
          },
          quantity: (choice: object, opt = { hasQty: true }): string => {
            let optChoiceKey = "";
            optChoiceKey += "QUANTITY_OPTION[";
            optChoiceKey += preOptChoiceKey;
            optChoiceKey += ",";
            optChoiceKey += choice['id'];
            optChoiceKey += ",";
            optChoiceKey += encodeURI(choice['name']);
            optChoiceKey += ",";
            optChoiceKey += choice['price'];
            optChoiceKey += ",";
            optChoiceKey += Currency[choice['currency']].symbol;
            if (opt.hasQty) {
              optChoiceKey += ",";
              optChoiceKey += choice['quantity']
            };
            optChoiceKey += "]";
            return optChoiceKey;
          }
        }
      }
    }
  }

  private static buildOrderLineOptionShortDescs() {
    return {
      ofOptions: (option: object) => {
        let preOptChoiceKey = "";
        preOptChoiceKey += encodeURI(option['name']);
        return {
          single: (): string => {
            const choice = option['choice'];
            let optChoiceKey = "";
            optChoiceKey += preOptChoiceKey;
            optChoiceKey += "[";
            optChoiceKey += encodeURI(choice['name']);
            optChoiceKey += ",";
            optChoiceKey += choice['price'];
            optChoiceKey += Currency[choice['currency']].symbol;
            optChoiceKey += "]";
            return optChoiceKey;
          },
          multiple: (choices: object[]): string => {
            let optChoiceKey = "";
            optChoiceKey += preOptChoiceKey;
            choices.forEach((choice, index) => {
              optChoiceKey += "[";
              optChoiceKey += encodeURI(choice['name']);
              optChoiceKey += ",";
              optChoiceKey += choice['price'];
              optChoiceKey += Currency[choice['currency']].symbol;
              optChoiceKey += "]";
            });
            return optChoiceKey;
          },
          quantity: (choices: object[]): string => {
            let optChoiceKey = "";
            optChoiceKey += preOptChoiceKey;

            choices.forEach((choice, index) => {
              optChoiceKey += "[";
              optChoiceKey += encodeURI(choice['name']);
              optChoiceKey += ",";
              optChoiceKey += choice['price'];
              optChoiceKey += Currency[choice['currency']].symbol;
              optChoiceKey += ",";
              optChoiceKey += "x" + choice['quantity'];
              optChoiceKey += "]";
            });

            return optChoiceKey;
          }
        }
      }
    }
  }
}