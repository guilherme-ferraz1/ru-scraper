# Ru Scraper

Gets the weekly [Universidade Federal de Santa Catarina (UFSC)](https://ru.ufsc.br/ru/) restaurant menu. 

- Base URL: `ru-ufsc-scraper.herokuapp.com`

- Florianópolis menu: `/cardapio-floripa`

**Response:**

Name | Type | Description
--- | --- | ---
dataFinal | `dd-mm-yy` | Last day of the menu
cardapio | **`menu[]`** | Array of daily menus

type **menu:**

Name | Type |
--- | --- |
carne | `string[]` |
fixas | `string[]` |
complemento | `string[]` |
salada | `string[]` |
molho | `string[]` |
sobremesa | `string[]` |


