# BMW wheel atlas: image sources and identification evidence

Delivery update, 2026-11-26: the owner approved public R2 upload and deployment.
All 269 local wheel assets were uploaded to the existing `here-hugo-prod-media`
bucket with content-fingerprinted keys under `research/wheels/`. Each public
object was downloaded and checked against its SHA-256 fingerprint and content
type. The application resolves images through `src/wheels/assets.json`, not
local static files. A checked public object returned `CF-Cache-Status: HIT`
and `Cache-Control: public, max-age=31536000, immutable`.
This operational approval is not a photographer's permission grant; the
individual source and rights limitations below still apply.

Evidence checked: 2026-11-25. Research only, no app changes, publication, or permission requests.

## Practical findings

- **BMWCarWheels is the usable starting point.** All requested numeric styles returned HTTP 200 with a thumbnail and gallery links. Its HTML contains the images directly, so there is no need for an undocumented API. Gallery membership is catalog attribution, not proof of OEM authenticity or photo ownership.
- **Do not treat the initial numeric list as an exact chart transcription.** The original image has eight columns, seven full rows, and seven cells in its final row: 63 cells. Several captions have no printed style number. “3 spoke”, “7 spoke”, Roman “II”, and the small “Page 22” line must not become style IDs 3, 7, 11, or 22.
- Keep the chart cell, its literal caption, a separately researched identification, and each photo's provenance as separate records. Preserve repeated 78 and 42 cells and different construction variants.
- Public image URLs are technically retrievable, not openly licensed. No blanket reuse permission was found on the inspected catalog pages.

## Original social sources and original-resolution images

The [FxTwitter response](https://api.fxtwitter.com/status/2124985492362182785) resolves the user's [BrenzGarage post](https://x.com/BrenzGarage/status/2124985492362182785) and its quoted chart post.

| Item | Verifiable result |
| --- | --- |
| BrenzGarage text | “Arguably a top 3 wheel of all time.” |
| Posted | 2026-11-23 21:56:36 UTC, according to the response |
| Car photo | https://pbs.twimg.com/media/HX13ClsbQAAu6Vr.jpg?name=orig |
| Photo dimensions reported by API | 4032 × 3024 |
| Quoted chart post | https://x.com/detta1z/status/2124824699779621292 |
| Chart original image | https://pbs.twimg.com/media/HXzkxwlXoAAyG6I.jpg?name=orig |
| Chart dimensions | 788 × 995, also downloaded and visually inspected |

The chart poster calls it an early-2000s “Original BMW Alloy Wheels” catalogue and credits BMW. That is a poster's provenance claim, not authentication of a particular edition. The image lacks a cover, publication number, date, and copyright page. FxTwitter is an independent intermediary, not an official X API. Do not describe the retrieved metadata as BMW confirmation or as a license.

### The white E46 photo: safe identification

Use **“White E46 with CSL-style cross-spoke wheels; exact wheel and OEM authenticity unverified.”** Do not label this individual wheel “genuine 163M” based on a rear-quarter photo.

The supposed 127-versus-163M distinction is itself more complicated than two unrelated designs:

- [BMWCarWheels style 127](https://www.bmwcarwheels.com/bmw/style-127) explicitly notes: “The rim was now renamed styling 163 M cross spoke.” It lists 19×8.5 ET44 front and 19×9.5 ET27 rear.
- [BimmerWorld's own genuine CSL front-wheel listing](https://www.bimmerworld.com/Wheels-Tires/Wheels/BMW-E46-M3-CSL-Style-163M-19x85-ET44-Front-Wheel.html) calls BMW part **36112282650** Style 163M, 19×8.5 ET44. It says the US ZCP wheel is similar but different, and identifies **36112282895** as the narrower alternative.
- [AlloyHub's CS wheel listing](https://www.alloyhub.com/product/bmw-style-163m-cs-36112282895-36112282999) gives **36112282895**, 19×8 ET47 front, and **36112282999**, 19×9.5 ET27 rear.
- [AlloyHub's CSL listing](https://www.alloyhub.com/product/bmw-style-163m-36112282650-36112282999) gives the wider CSL front and the same listed rear part number.

These sellers are primary evidence of their own product identifications, not BMW's original homologation record. Shared rear dimensions and listed part numbers make the rear photograph especially poor evidence for separating CSL and CS/ZCP sets. Replicas can reproduce the face. Authentication requires rear-side casting/stamping, part numbers, dimensions, and ideally owner confirmation. Do not add this wheel to the 63-cell historical chart as if it were printed there.

## Chart transcription: all 63 cells

Source: [original chart image](https://pbs.twimg.com/media/HXzkxwlXoAAyG6I.jpg?name=orig), visually inspected. Line breaks are flattened below. Asterisks are transcribed where legible; their footnote is absent. “No number” means no style number is visible in the caption, not that the wheel has no real style number. Page numbers are not included in the caption column.

| Cell | Visible caption | Printed numeric style |
| --- | --- | --- |
| r1c1 | Cross spoke composite wheel 78 | 78 |
| r1c2 | Z star, styling 35 | 35 |
| r1c3 | Star spoke 43 | 43 |
| r1c4 | Cross spoke 42 | 42 |
| r1c5 | Radial spoke 50 | 50 |
| r1c6 | Star spoke 45 | 45 |
| r1c7 | Parallel spoke 85 | 85 |
| r1c8 | Star spoke 55 | 55 |
| r2c1 | Streamline 41 | 41 |
| r2c2 | Double spoke 79 | 79 |
| r2c3 | Classic styling 25* | 25 |
| r2c4 | Flat star styling 16* | 16 |
| r2c5 | Radial styling 32 | 32 |
| r2c6 | Double spoke 51 | 51 |
| r2c7 | Double spoke | No number |
| r2c8 | Star spoke II, | No number |
| r3c1 | Star spoke 81 | 81 |
| r3c2 | Star spoke 83 | 83 |
| r3c3 | 3 spoke styling, | No number |
| r3c4 | 7 spoke composite, | No number |
| r3c5 | Star spoke 89 | 89 |
| r3c6 | Radial spoke 48 | 48 |
| r3c7 | Cross spoke, | No number |
| r3c8 | Star spoke composite | No number |
| r4c1 | Star spoke 87 | 87 |
| r4c2 | Ellipsoid styling 56 | 56 |
| r4c3 | V spoke 63 | 63 |
| r4c4 | Double spoke composite wheel 75 | 75 |
| r4c5 | Star spoke 58 | 58 |
| r4c6 | Star spoke 57 | 57 |
| r4c7 | M V spoke 72 | 72 |
| r4c8 | M parallel spoke II, styling 65 | 65 |
| r5c1 | Double spoke styling 30 | 30 |
| r5c2 | Double spoke 47 | 47 |
| r5c3 | Cross spoke composite wheel, styling 5 | 5 |
| r5c4 | Cross spoke 78 | 78 |
| r5c5 | Star spoke 44 | 44 |
| r5c6 | Radial spoke 73 | 73 |
| r5c7 | Star spoke 64 | 64 |
| r5c8 | V spoke 54 | 54 |
| r6c1 | Radial spoke composite wheel 86 | 86 |
| r6c2 | Ellipsoid styling 46* | 46 |
| r6c3 | Ellipsoid styling 26* | 26 |
| r6c4 | Star spoke composite wheel 77 | 77 |
| r6c5 | Star spoke 49 | 49 |
| r6c6 | BMW styling II, styling 91 | 91 |
| r6c7 | Parallel spoke 82 | 82 |
| r6c8 | Spoke styling 33 | 33 |
| r7c1 | Star spoke 70 | 70 |
| r7c2 | Round spoke styling 18 | 18 |
| r7c3 | Cross spoke composite wheel II, styling 42 | 42 |
| r7c4 | Y spoke 80 | 80 |
| r7c5 | Radial spoke 61 | 61 |
| r7c6 | Star spoke 69 | 69 |
| r7c7 | Ellipsoid styling 60 | 60 |
| r7c8 | Star spoke 74 | 74 |
| r8c1 | M double spoke 67 | 67 |
| r8c2 | M double spoke 24 | 24 |
| r8c3 | M double spoke 68 | 68 |
| r8c4 | M double spoke 22* | 22 |
| r8c5 | M parallel spoke 66 | 66 |
| r8c6 | M parallel spoke 37 | 37 |
| r8c7 | M double spoke II, styling 39* | 39 |

Do not silently replace the unusual printed “M parallel spoke II, styling 65” with a modern catalog name. Keep a separate normalized name, since the [style 65 catalog](https://www.bmwcarwheels.com/bmw/style-65) calls it M Double Spoke.

### Unnumbered caption research, separate from transcription

| Cell | Evidence and limit |
| --- | --- |
| r2c7 | “Page 22” is a brochure page reference, not wheel style 22. Exact style unresolved here. |
| r2c8 | Roman II is not 11. [BMWFans ETK-derived page](http://bmwfans.info/parts-catalog/E39-Touring/Europe/530i-M54/L-M/browse/wheels/star_spoke_styling_ii_styl_10_) names “Star-spoke styling II (styl.10)”. This supports a style-10-family identification, separately from the literal caption; verify the particular variant. |
| r3c3 | [BMWFans ETK-derived page](http://bmwfans.info/parts-catalog/E39-Sedan/Europe/540i-M62/L-M/mar1996/browse/wheels/3_spoke_styling_styl_38) identifies “3-spoke styling (styl.38)”, including 36111092965 and 36111092966. Strong terminology match for 38, not style 3. |
| r3c4 | [BMWPartsDeal catalog](https://www.bmwpartsdeal.com/parts-list/1997-bmw-328is-coupe_e36/wheels/7_spoke_composite_wheel.html) explicitly identifies “7-spoke composite wheel (styl.19)”, including 36111182482. Strong terminology match for 19, not style 7. |
| r3c7 | Style 29 remains a candidate, not a printed identification. [BMWStyleWheels indexed page](http://www.bmwstylewheels.com/bmw/29) and [BMWCarWheels](https://www.bmwcarwheels.com/bmw/style-29) identify Cross Spoke 29, but this caption only says Cross spoke. Need the brochure's page 33 or a part-number comparison. |
| r3c8 | Exact number unresolved. Do not default to 71: the [71 catalog](https://www.bmwcarwheels.com/bmw/style-71) calls that Double Spoke Split Rim. Also do not collapse this cell into the separately printed style 77 at r6c4. Need brochure page 34. |

BMWFans and BMWPartsDeal expose BMW-derived parts terminology but are not BMW-owned sources. Their evidence is stronger than guessing from spoke count, weaker than the original BMW page or a stamped wheel.

## BMWCarWheels image extraction

Verified HTML example: [Style 65](https://www.bmwcarwheels.com/bmw/style-65).

```text
Style page
  https://www.bmwcarwheels.com/bmw/style-65
  |
  +-- thumbnail img src
  |   /img/thumbs/bmw-wheels-style-65.jpg
  |
  +-- lightbox anchor href, with matching img src
      /foto/65/zNy2ArF.jpg
      /foto/65/k6fHLkM.jpg
```

Practical URL patterns:

- Detail page: `https://www.bmwcarwheels.com/bmw/style-{id}`.
- Thumbnail observed on every requested numeric page: `https://www.bmwcarwheels.com/img/thumbs/bmw-wheels-style-{id}.jpg`.
- Gallery: `https://www.bmwcarwheels.com/foto/{id}/{opaque-name}.jpg`.
- Extract the actual `a[data-toggle="lightbox"][data-gallery="gallery"]` links and resolve relative URLs against the page URL. Do not invent opaque filenames, or assume `og:image` is a clean wheel closeup.

Direct downloads of the following three URLs returned HTTP 200 and `image/jpeg`; their pixels were inspected:

| Image | Actual contents |
| --- | --- |
| https://www.bmwcarwheels.com/img/thumbs/bmw-wheels-style-65.jpg | 175×175 mounted-wheel closeup, visibly photographed rather than a cutout |
| https://www.bmwcarwheels.com/foto/65/zNy2ArF.jpg | 512×384 photograph of four loose wheels on boxes |
| https://www.bmwcarwheels.com/foto/65/k6fHLkM.jpg | 512×384 side view of an older BMW sedan wearing the catalog-attributed wheels |

The on-car image is not an E39 M5: it illustrates that catalog galleries can contain swaps. Catalog fitment metadata must not be used as the identity of the pictured car. These photos do not establish that a particular rim is genuine, original finish, or stock size.

### Requested numeric styles: live HTML coverage

Every linked page below returned HTTP 200. Counts are unique gallery hrefs, not verified photographs, license-cleared assets, or verified on-car counts. First filename is an observed link, not a curated image choice. Prefix it with `https://www.bmwcarwheels.com/foto/{style}/`.

| Style and source | Gallery links | First filename |
| --- | ---: | --- |
| [78](https://www.bmwcarwheels.com/bmw/style-78) | 29 | C8HImFN.jpg |
| [35](https://www.bmwcarwheels.com/bmw/style-35) | 16 | xBTOJJ4.jpg |
| [43](https://www.bmwcarwheels.com/bmw/style-43) | 51 | Sq0waJ3.jpg |
| [42](https://www.bmwcarwheels.com/bmw/style-42) | 102 | SkjeEJd.jpg |
| [50](https://www.bmwcarwheels.com/bmw/style-50) | 36 | iMML0Bf.jpg |
| [45](https://www.bmwcarwheels.com/bmw/style-45) | 55 | ECqWFLV.jpg |
| [85](https://www.bmwcarwheels.com/bmw/style-85) | 22 | MmIwQsH.jpg |
| [55](https://www.bmwcarwheels.com/bmw/style-55) | 9 | xfvHmu4.jpg |
| [41](https://www.bmwcarwheels.com/bmw/style-41) | 15 | XOcLyLY.jpg |
| [79](https://www.bmwcarwheels.com/bmw/style-79) | 21 | 2LdRcDp.jpg |
| [25](https://www.bmwcarwheels.com/bmw/style-25) | 19 | ZmRUpF2.jpg |
| [16](https://www.bmwcarwheels.com/bmw/style-16) | 33 | A4jVrIs.jpg |
| [32](https://www.bmwcarwheels.com/bmw/style-32) | 226 | lXF1wuX.jpg |
| [51](https://www.bmwcarwheels.com/bmw/style-51) | 6 | lrTVBzO.jpg |
| [22](https://www.bmwcarwheels.com/bmw/style-22) | 39 | C2h5AOP.jpg |
| [11](https://www.bmwcarwheels.com/bmw/style-11) | 21 | wkGYdYZ.jpg |
| [81](https://www.bmwcarwheels.com/bmw/style-81) | 47 | RDNqcvn.jpg |
| [83](https://www.bmwcarwheels.com/bmw/style-83) | 31 | aWuFwXo.jpg |
| [3](https://www.bmwcarwheels.com/bmw/style-3) | 18 | CTZDyNA.jpg |
| [7](https://www.bmwcarwheels.com/bmw/style-7) | 14 | 84ZeF9r.jpg |
| [89](https://www.bmwcarwheels.com/bmw/style-89) | 40 | RACzkxG.jpg |
| [48](https://www.bmwcarwheels.com/bmw/style-48) | 42 | f5ZriiK.jpg |
| [29](https://www.bmwcarwheels.com/bmw/style-29) | 29 | xEjw9p5.jpg |
| [71](https://www.bmwcarwheels.com/bmw/style-71), investigated candidate only | 59 | 9pqW8oA.jpg |
| [87](https://www.bmwcarwheels.com/bmw/style-87) | 37 | efSbeKK.jpg |
| [56](https://www.bmwcarwheels.com/bmw/style-56) | 16 | qdyuhuu.jpg |
| [63](https://www.bmwcarwheels.com/bmw/style-63) | 76 | IsLi2Qf.jpg |
| [75](https://www.bmwcarwheels.com/bmw/style-75) | 11 | N5y0OLC.jpg |
| [58](https://www.bmwcarwheels.com/bmw/style-58) | 15 | Yh04noY.jpg |
| [57](https://www.bmwcarwheels.com/bmw/style-57) | 36 | jFi5lC2.jpg |
| [72](https://www.bmwcarwheels.com/bmw/style-72) | 92 | DD44aXP.jpg |
| [65](https://www.bmwcarwheels.com/bmw/style-65) | 92 | zNy2ArF.jpg |
| [30](https://www.bmwcarwheels.com/bmw/style-30) | 38 | cwjuyTi.jpg |
| [47](https://www.bmwcarwheels.com/bmw/style-47) | 11 | 0tMb4OO.jpg |
| [5](https://www.bmwcarwheels.com/bmw/style-5) | 117 | tNIftra.jpg |
| [44](https://www.bmwcarwheels.com/bmw/style-44) | 106 | ZnPa0E7.jpg |
| [73](https://www.bmwcarwheels.com/bmw/style-73) | 73 | f2RSepj.jpg |
| [64](https://www.bmwcarwheels.com/bmw/style-64) | 6 | IxBOFbc.jpg |
| [54](https://www.bmwcarwheels.com/bmw/style-54) | 3 | JcS0NqG.jpg |
| [86](https://www.bmwcarwheels.com/bmw/style-86) | 7 | DywYUD2.jpg |
| [46](https://www.bmwcarwheels.com/bmw/style-46) | 36 | dWsbu3W.jpg |
| [26](https://www.bmwcarwheels.com/bmw/style-26) | 5 | vOq2RYy.jpg |
| [77](https://www.bmwcarwheels.com/bmw/style-77) | 3 | M3RzSg5.jpg |
| [49](https://www.bmwcarwheels.com/bmw/style-49) | 29 | BRS94wM.jpg |
| [91](https://www.bmwcarwheels.com/bmw/style-91) | 23 | TB32Ynw.jpg |
| [82](https://www.bmwcarwheels.com/bmw/style-82) | 23 | PNxQqu8.jpg |
| [33](https://www.bmwcarwheels.com/bmw/style-33) | 61 | 6sfN4r2.jpg |
| [70](https://www.bmwcarwheels.com/bmw/style-70) | 7 | 4e09hUM.jpg |
| [18](https://www.bmwcarwheels.com/bmw/style-18) | 69 | 9BSXotM.jpg |
| [80](https://www.bmwcarwheels.com/bmw/style-80) | 32 | AM73Hqn.jpg |
| [61](https://www.bmwcarwheels.com/bmw/style-61) | 31 | pa474LN.jpg |
| [69](https://www.bmwcarwheels.com/bmw/style-69) | 39 | R8Pe2fv.jpg |
| [60](https://www.bmwcarwheels.com/bmw/style-60) | 17 | Z49tPrK.jpg |
| [74](https://www.bmwcarwheels.com/bmw/style-74) | 24 | Vnf0WdC.jpg |
| [67](https://www.bmwcarwheels.com/bmw/style-67) | 80 | RQ61P7Y.jpg |
| [24](https://www.bmwcarwheels.com/bmw/style-24) | 51 | B93SOpB.jpg |
| [68](https://www.bmwcarwheels.com/bmw/style-68) | 143 | ZOKF7nt.jpg |
| [66](https://www.bmwcarwheels.com/bmw/style-66) | 95 | XfMAkir.jpg |
| [37](https://www.bmwcarwheels.com/bmw/style-37) | 165 | W53lgHa.jpg |
| [39](https://www.bmwcarwheels.com/bmw/style-39) | 25 | lmen3ae.jpg |

Styles 11, 3, and 7 above are included because they were requested, not because the chart labels establish those identities. The [11 page](https://www.bmwcarwheels.com/bmw/style-11) calls it a Z1 spare; [3](https://www.bmwcarwheels.com/bmw/style-3) calls it Scheibenrad LM forged; [7](https://www.bmwcarwheels.com/bmw/style-7) calls it TD-Styling. Those are not the unnumbered captions in the chart.

### Variant warning: style 5

The chart explicitly says composite. The site's main [style 5 page](https://www.bmwcarwheels.com/bmw/style-5) is not enough to choose that construction: the [index](https://www.bmwcarwheels.com/) separately lists Style 5 Split Rim, Style 5 TRX, Style 18 Chrome, and other variants. Resolve the actual split-rim link from the index before sourcing style 5 composite photos. One number alone does not identify every construction, diameter, or finish.

## Other sources and extraction limits

### BMWStyleWheels

The search index exposes [the all-styles catalog](http://www.bmwstylewheels.com/), [29](http://www.bmwstylewheels.com/bmw/29), [71](http://www.bmwstylewheels.com/bmw/71), and [127](http://www.bmwstylewheels.com/bmw/127), including chassis/size/offset tables and repeated photo labels. Direct requests in this session failed: HTTPS transport errors and HTTP 503 for style 65. Therefore:

- Its page pattern `/bmw/{id}` is supported by indexed source links.
- Its current image filename pattern was **not verified**. Do not fabricate `/images/` or `/foto/` URLs on this host by copying another site's convention.
- Indexed content is useful corroboration, not evidence of current download availability.
- Indexed footer: © BmwStyleWheels.com 2012 and info@BmwStyleWheels.com. No open license was established.

### BMW OEM Wheel Styles

The live [all-wheels HTML](https://bmwoemwheelstyles.com/all-wheels) includes native image tags, JSON-LD, and links like `https://bmwoemwheelstyles.com/bmw-oem-wheel-style-32/`. It advertises WordPress JSON at `/wp-json/` and `/wp-json/wp/v2/pages/1040`; those API routes were not separately validated.

Observed image examples:

- https://bmwoemwheelstyles.com/wp-content/uploads/2023/10/BMW-OEM-Wheel-Style-32.webp
- https://bmwoemwheelstyles.com/wp-content/uploads/2026/07/BMW361110927185.webp

**Photo-authenticity caution:** its style 21 lead image filename contains `ChatGPT-Image-Sep-27-2026-10_47_37-PM.webp`. A filename is not conclusive proof of generation, but this is a serious warning against treating every catalog image as a real wheel photograph. Inspect provenance and pixels individually. Do not use its thumbnail set as an unquestioned replacement for real photos.

### BMW OEM Wheels, separate domain

[bmwoemwheels.com](https://www.bmwoemwheels.com/en/) exposes pages such as `/rim-models/bmw-wheel-style-19/` and images under `/media//bmw/`, with opaque prefixes, spaces, case-sensitive extensions, and lazy-loaded `data-src` attributes. An observed style-19 image is `https://bmwoemwheels.com/media//bmw/a1f0eb74e573.jpg`. Parse actual attributes and preserve case; do not infer names. No photo reuse grant was established.

## Original BMW documents: useful leads, not a solved brochure identity

1. [BMW Umrüstkatalog Band 1, June 2000, mirrored at ow.no](http://www.ow.no/archive/urk/uk1_01.pdf): indexed text explicitly lists “Rad-Styling-Übersicht der aktuellen BMW Räder” on page 3 and factory-approved wheel/tire combinations. A promising period BMW-authored document for identification. This PDF was found through search, not downloaded or page-rendered in this task, and is not established as the chart's source.
2. [Bimmerbrochures parts/accessories collection](https://www.bimmerbrochures.com/other-bmw-brochures-and-items/01-parts-and-accessories): records 2000-01 Alloy wheels NL **01 26 0 300 208**, 2000-05 USA Alloy wheels **PD1-0100-35M** as printed there with a leading “x” marker, and 2001-01 Alloy wheels NL **01 26 0 029 014**. These are collector catalog leads, not confirmed matching editions or download licenses.
3. [BMW's own 2018 accessory catalog hosted on bmw.com.sg](https://www.bmw.com.sg/content/dam/bmw/marketASIA/common/topics/offers-and-services/original-bmw-accessories/catalogue/pdf/bmw_accessories_catalogue_1series_2series_x1_x2_2018.pdf.asset.1527496303713.pdf): primary BMW source for modern naming conventions and rights language, but wrong era for this chart. Indexed text states © BMW AG and that reproduction requires written permission. It does not license the older chart.

Next useful research action: obtain the actual English brochure's pages **22, 30, 33, and 34** plus cover/imprint, rather than assign numbers to its unnumbered captions. The image visibly references those pages.

## Rights and implementation handoff

- [BMWCarWheels contacts](https://www.bmwcarwheels.com/contacts) provides info@bmwcarwheels.com and a © 2021 footer, not a reusable-media license. The inspected gallery HTML provides generic style alt text but no photographer credit, original upload page, or rights field.
- Ask the catalog operator about both permission and underlying photographer rights. Attribution alone is not permission. A collection operator may not own every submitted image.
- The tweet is evidence of who posted an image, not necessarily who photographed it. Request permission from the rights holder before rehosting. An official embed or link is a lower-copying alternative, subject to platform terms.
- Do not assume private prototyping makes every download or redistribution lawful. Keep source-page links, retrieval date, original URL, credit, license/permission status, and visual-identification confidence for each asset.
- Prefer user-owned photos, owner submissions with clear consent, or individually verified open-license images for a public atlas. No all-63-cell license-cleared on-car collection was established here.
- Before shipping, visually curate every closeup/on-car pair, confirm the depicted wheel and car separately, and distinguish replicas, swaps, refinishes, and construction variants. Three image downloads were visually inspected here, not every gallery.
- The research proves live numeric source-page coverage, not complete accurate identification of all 63 chart cells or publication clearance.

## Addendum, 2026-11-25: higher-resolution image round

Evidence checked 2026-11-25 by Claude (local headless session). Per-image records, with served and original pixel dimensions, source page, original file URL, credit, licence and match level, live in `apps/research/src/wheels/media.json`.

### Sources that materially improved resolution

| Source | What it gave | Native size | Rights |
| --- | --- | --- | --- |
| [BMW OEM Wheel Styles](https://bmwoemwheelstyles.com/all-wheels) style pages | Embedded gallery JSON (`url`, `w`, `h`, `credit`, `owner`) per style. Product photographs named by BMW part number, plus owner-submitted and gallery car photographs | Product shots 1200 × 1200; car photos mostly 1080 to 1200 px; nothing above 1200 px | No reuse licence stated. A few owner submissions carry a named credit |
| Wikimedia Commons, [Wheels of BMW vehicles](https://commons.wikimedia.org/wiki/Category:Wheels_of_BMW_vehicles) | Close wheel photographs of period cars by The Car Spy | 1600 × 1200 | CC BY 2.0 |
| Original Flickr uploads of the same Car Spy files | Identical pixels when Commons' upload server rate-limited this machine (HTTP 429) | 1600 × 1200, dimensions checked against Commons metadata | CC BY 2.0 |
| [BrenzGarage original](https://pbs.twimg.com/media/HX13ClsbQAAu6Vr.jpg?name=orig) | User-supplied E46 photograph | 4032 × 3024, served as a 2400 × 1800 non-generative downscale | No reuse licence stated |

Commons wheel matches, verified by eye against the chart crop: Style 37 (1998 740i Individual, 750iL Individual), Style 65 (2002 M5), Style 67 (E46 M3 Convertible), Style 24 (M3 Evo E36 Convertible and Coupe), Style 42 one-piece (Z3 3.0i 2001) and Style 42 riveted composite (Z3 3.0i 2002). Rejected after inspection: an X5 3.0d Sport wheel (spoke shape differs from Style 87), a Mahle mesh wheel resembling Style 5, AC Schnitzer and Alpina wheels.

### Visual evidence on unnumbered cells

- r3c4: the Style 19 product photograph shows seven spokes and a riveted rim, matching the crop and the “7-spoke composite (styl.19)” terminology. Still a candidate until a brochure page or part number confirms it.
- r3c3: Style 38's three-spoke product photograph matches the crop. Candidate.
- r2c8 and r3c7: Style 10 and Style 29 are visually consistent, but a 71 × 88 crop cannot separate similar stars or meshes. Candidates.
- r2c7 and r3c8: unresolved. No photograph is shown.

### Limits

- No source found here supplies 1600 px+ on-car photographs for most styles. The BMW OEM Wheel Styles uploads cap at about 1200 px.
- Product photographs are clean cutouts from a third-party host. The site has hosted at least one image with a ChatGPT filename (Style 21). No selected file had such a name and each was checked by eye, but retouching or generation cannot be ruled out from pixels alone.
- Car descriptions say only what is visible (colour, body, series where obvious). Fitment metadata was not used to name cars.
- One Commons original (BMW M3 E46 Cabrio detail, 3072 × 2304, CC BY-SA 2.5) could not be downloaded because of the rate limit and is not shown.
