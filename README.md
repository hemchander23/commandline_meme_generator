# Light-weight CLI to generate meme from image

## Example :

`mkmeme create-meme  "New Feature|Developers" -i "sample/input.jpg" -o 'sample/output.jpg' -s 1.6 -p "20|500" -a 'C'`

## Command 
`mkmeme create-meme <text>`

where `<text>` contains multiple lines delimited by `|` symbol

## Options:



| Short Flag | Long Name |Type | Description |
| ----------- | ----------- | ----------- | ----------- |
| -i | --imagein | string | Input Image - provide path| 
| -o | --imageout | string | Output Image - provide path|
| -s | --scale | float | Multiplier to adjust the image zoom/scale. Default is 1 |
| -p | --position | string  | Provide values seperated by `|` symbol to place the text at the respective Y-coordinate |
| -a | --align | string | Provide a alignment value. Default is center (C) . Possible values are [L,C,R]|

## Before:

![](sample/input.jpg)

## After:

![](sample/output.jpg)

## To Contribute:

1. Fork this repository and `cd` into the directory
2. Do `npm i -g`
3. Run the test command to generate a sample MEME
4. Create a feature branch and start making changes
5. Once you are done, raise a PR. 
6. Changes (if any) will be suggested. Kindly make the necessary changes.
7. Upon approval, PR will be merged !!! 🎉

Contributions are welcome !
