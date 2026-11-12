import heroOutdoorImg from '../assets/images/hero_outdoor_ration_1794272200707.jpg';
import heroOpenedImg from '../assets/images/hero_opened_contents_1794272201293.jpg';
import heroDawnImg from '../assets/images/hero_dawn_table_1794272201462.jpg';

import ration24hOutdoorImg from '../assets/images/ration_24h_outdoor_1794272201798.jpg';
import ration24hCloseupImg from '../assets/images/ration_24h_closeup_1794272202247.jpg';
import ration48hOutdoorImg from '../assets/images/ration_48h_outdoor_1794272203059.jpg';
import ration48hCloseupImg from '../assets/images/ration_48h_closeup_1794272202904.jpg';
import ration72hOutdoorImg from '../assets/images/ration_72h_outdoor_1794272204256.jpg';
import ration72hCloseupImg from '../assets/images/ration_72h_closeup_1794272204577.jpg';
import energyPackOutdoorImg from '../assets/images/energy_pack_outdoor_1794272204404.jpg';
import energyPackCloseupImg from '../assets/images/energy_pack_closeup_1794272204993.jpg';
import fieldKitOutdoorImg from '../assets/images/field_kit_outdoor_1794272205625.jpg';
import fieldKitCloseupImg from '../assets/images/field_kit_closeup_1794272205741.jpg';

export interface RationComponent {
  id: string;
  name: string;
  category: 'Danie główne' | 'Przekąska' | 'Hydratacja' | 'Akcesorium';
  portionLabel: string;
  weightG: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  ingredients: string;
  preparation: string;
}

export interface ComputedComponent extends RationComponent {
  kcal: number;
  kj: number;
}

export interface RationProduct {
  id: string;
  shopifyVariantId: string;
  sku: string;
  slug: string;
  name: string;
  shortTag: string;
  category: 'Racje dobowe' | 'Pakiety energetyczne' | 'Zestawy terenowe';
  durationHours: number;
  pricePln: number;
  shelfLifeMonths: number;
  mealsCount: number;
  portionsCount: number;
  packagingWeightG: number;
  waterRequiredMl: number;
  summary: string;
  fieldUse: string;
  outdoorImage: string;
  closeupImage: string;
  outdoorAlt: string;
  closeupAlt: string;
  dropStatus: 'DROP 001' | 'LIMITOWANA PARTIA';
  components: RationComponent[];
}

export interface ComputedNutrition {
  kcal: number;
  kj: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  netFoodWeightG: number;
  grossWeightG: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  components: ComputedComponent[];
}

export function computeComponentEnergy(c: RationComponent): ComputedComponent {
  const kcal = c.proteinG * 4 + c.carbsG * 4 + c.fatG * 9;
  const kj = Math.round(kcal * 4.184);
  return { ...c, kcal, kj };
}

export function computeRationNutrition(product: RationProduct): ComputedNutrition {
  const computed = product.components.map(computeComponentEnergy);
  const kcal = computed.reduce((sum, item) => sum + item.kcal, 0);
  const proteinG = computed.reduce((sum, item) => sum + item.proteinG, 0);
  const carbsG = computed.reduce((sum, item) => sum + item.carbsG, 0);
  const fatG = computed.reduce((sum, item) => sum + item.fatG, 0);
  const fiberG = computed.reduce((sum, item) => sum + item.fiberG, 0);
  const netFoodWeightG = computed.reduce(
    (sum, item) => sum + (item.category !== 'Akcesorium' ? item.weightG : 0),
    0
  );
  const accessoriesWeightG = computed.reduce(
    (sum, item) => sum + (item.category === 'Akcesorium' ? item.weightG : 0),
    0
  );
  const grossWeightG = netFoodWeightG + accessoriesWeightG + product.packagingWeightG;
  const kj = Math.round(kcal * 4.184);

  const safeKcal = kcal > 0 ? kcal : 1;
  const proteinPct = Math.round(((proteinG * 4) / safeKcal) * 100);
  const carbsPct = Math.round(((carbsG * 4) / safeKcal) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  return {
    kcal,
    kj,
    proteinG,
    carbsG,
    fatG,
    fiberG,
    netFoodWeightG,
    grossWeightG,
    proteinPct,
    carbsPct,
    fatPct,
    components: computed,
  };
}

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  caption: string;
  coordinates: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: heroOutdoorImg,
    alt: 'Racja żywnościowa MILVITA w surowym terenie górskim na mokrym granicie',
    caption: '01 / PAKIET TERENOWY W WARUNKACH GÓRSKICH',
    coordinates: '49°34′N 19°21′E · 1420 M N.P.M.',
  },
  {
    id: 'slide-2',
    image: heroOpenedImg,
    alt: 'Otwarta racja MILVITA ukazująca saszetki dań głównych, batony, czekoladę i izotoniki',
    caption: '02 / PEŁNA KONFIGURACJA POSIŁKÓW I EKWIWALENT ENERGETYCZNY',
    coordinates: 'MODUŁ 24H · RECEPTURA DROP 001',
  },
  {
    id: 'slide-3',
    image: heroDawnImg,
    alt: 'Ekwipunek przetrwania i racja MILVITA na drewnianym stole polowym o świcie',
    caption: '03 / ODPRAWA POLOWA O ŚWICIE',
    coordinates: '05:14 CET · TEMP. +2°C · WILGOTNOŚĆ 86%',
  },
];

export const RATION_PRODUCTS: RationProduct[] = [
  {
    id: 'prod-24h',
    shopifyVariantId: 'gid://shopify/ProductVariant/4410024001',
    sku: 'MV-D1-24H',
    slug: 'milvita-24h-ration',
    name: 'MILVITA 24H RATION',
    shortTag: '24H / 3 DANIA + 5 MODUŁÓW',
    category: 'Racje dobowe',
    durationHours: 24,
    pricePln: 129,
    shelfLifeMonths: 36,
    mealsCount: 3,
    portionsCount: 8,
    packagingWeightG: 65,
    waterRequiredMl: 500,
    summary:
      'Kompletna dobowa racja żywnościowa gotowa do spożycia. Zaprojektowana na 24 godziny autonomicznego działania w terenie bez dostępu do kuchni.',
    fieldUse:
      'Jednodniowe patrole, zimowe wyjścia graniowe, plecak ewakuacyjny 24H. Dania retortowe gotowe na zimno lub po podgrzaniu bezpłomieniowym.',
    outdoorImage: ration24hOutdoorImg,
    closeupImage: ration24hCloseupImg,
    outdoorAlt: 'MILVITA 24H RATION na omszałej skale w górskim lesie',
    closeupAlt: 'Otwarta zawartość MILVITA 24H RATION: trzy saszetki dań, dwa batony, orzechy i izotoniki',
    dropStatus: 'DROP 001',
    components: [
      {
        id: '24h-c1',
        name: 'Gulasz wołowy z kaszą gryczaną',
        category: 'Danie główne',
        portionLabel: '1 saszetka retortowa (350 g)',
        weightG: 350,
        proteinG: 30,
        carbsG: 48,
        fatG: 20,
        fiberG: 6,
        ingredients:
          'Wołowina duszona (38%), kasza gryczana prażona (28%), bulion wołowy, marchew, cebula, koncentrat pomidorowy, olej rzepakowy, sól morska, majeranek, pieprz czarny.',
        preparation: 'Gotowe do spożycia na zimno lub podgrzać przez 8 min w podgrzewaczu FRH.',
      },
      {
        id: '24h-c2',
        name: 'Kurczak z ryżem i warzywami',
        category: 'Danie główne',
        portionLabel: '1 saszetka retortowa (350 g)',
        weightG: 350,
        proteinG: 32,
        carbsG: 52,
        fatG: 14,
        fiberG: 5,
        ingredients:
          'Pierś z kurczaka (36%), ryż parboiled (30%), papryka czerwona, groszek, kukurydza, oliwa z oliwek, kurkuma, czosnek, sól.',
        preparation: 'Spożywać bezpośrednio z saszetki po wymieszaniu lub po podgrzaniu.',
      },
      {
        id: '24h-c3',
        name: 'Makaron z sosem pomidorowo-wołowym',
        category: 'Danie główne',
        portionLabel: '1 saszetka retortowa (350 g)',
        weightG: 350,
        proteinG: 26,
        carbsG: 58,
        fatG: 16,
        fiberG: 5,
        ingredients:
          'Makaron z pszenicy durum (34%), mielona wołowina (24%), passata pomidorowa (22%), oliwa, cebula, bazylia, oregano, sól.',
        preparation: 'Gotowe do spożycia bezpośrednio z opakowania lub z użyciem podgrzewacza.',
      },
      {
        id: '24h-c4',
        name: 'Kompresowane batony owsiano-miodowe',
        category: 'Przekąska',
        portionLabel: '2 × 100 g',
        weightG: 200,
        proteinG: 18,
        carbsG: 122,
        fatG: 32,
        fiberG: 14,
        ingredients:
          'Płatki owsiane pełnoziarniste (54%), miód wielokwiatowy (16%), olej kokosowy tłoczony na zimno, słonecznik, syrop ryżowy, sól.',
        preparation: 'Spożywać w trakcie marszu. Nie kruszy się w temperaturach ujemnych.',
      },
      {
        id: '24h-c5',
        name: 'Mieszanka prażonych orzechów',
        category: 'Przekąska',
        portionLabel: '1 pakiet próżniowy (100 g)',
        weightG: 100,
        proteinG: 21,
        carbsG: 18,
        fatG: 50,
        fiberG: 8,
        ingredients:
          'Migdały prażone (40%), orzechy nerkowca (30%), orzeszki ziemne prażone z solą morską (30%).',
        preparation: 'Przekąska wysokotłuszczowa do podziału na dwie przerwy w marszu.',
      },
      {
        id: '24h-c6',
        name: 'Ciemna czekolada terenowa 70% kakao',
        category: 'Przekąska',
        portionLabel: '1 tabliczka (50 g)',
        weightG: 50,
        proteinG: 4,
        carbsG: 19,
        fatG: 21,
        fiberG: 5,
        ingredients:
          'Miazga kakaowa (70%), cukier trzcinowy nierafinowany, tłuszcz kakaowy, sól morska.',
        preparation: 'Stabilna termicznie do +38°C. Spożywać bezpośrednio.',
      },
      {
        id: '24h-c7',
        name: 'Koncentrat izotoniczny (Pomarańcza)',
        category: 'Hydratacja',
        portionLabel: '2 saszetki × 25 g',
        weightG: 50,
        proteinG: 0,
        carbsG: 46,
        fatG: 0,
        fiberG: 0,
        ingredients:
          'Dekstroza, maltodekstryna, cytrynian sodu, chlorek potasu, sole magnezowe, naturalny aromat pomarańczowy, witamina C.',
        preparation: 'Rozpuścić 1 saszetkę w 250 ml czystej wody.',
      },
      {
        id: '24h-c8',
        name: 'Kawa czarna liofilizowana + przyprawy',
        category: 'Hydratacja',
        portionLabel: '1 pakiet (10 g)',
        weightG: 10,
        proteinG: 0,
        carbsG: 2,
        fatG: 0,
        fiberG: 0,
        ingredients: 'Kawa rozpuszczalna Arabica (3 g), cukier trzcinowy (5 g), sól i pieprz (2 g).',
        preparation: 'Kawę zalać 150 ml gorącej lub zimnej wody.',
      },
      {
        id: '24h-c9',
        name: 'Zestaw podgrzewaczy i akcesoriów 24H',
        category: 'Akcesorium',
        portionLabel: '2× FRH, łyżka, zapałki, chusteczki',
        weightG: 75,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        fiberG: 0,
        ingredients:
          '2× bezpłomieniowy podgrzewacz chemiczny (Mg-Fe), 1× łyżka kompozytowa, 2× chusteczka antybakteryjna, zapałki sztormowe.',
        preparation: 'Do podgrzania saszetki dolać 45 ml dowolnej wody do rękawa FRH.',
      },
    ],
  },
  {
    id: 'prod-48h',
    shopifyVariantId: 'gid://shopify/ProductVariant/4410048002',
    sku: 'MV-D1-48H',
    slug: 'milvita-48h-ration',
    name: 'MILVITA 48H RATION',
    shortTag: '48H / 6 DAŃ + 14 MODUŁÓW',
    category: 'Racje dobowe',
    durationHours: 48,
    pricePln: 249,
    shelfLifeMonths: 36,
    mealsCount: 6,
    portionsCount: 20,
    packagingWeightG: 140,
    waterRequiredMl: 1500,
    summary:
      'Rozszerzony zapas żywności na 48 godzin intensywnego wysiłku terenowego. Wzmocniona podaż białka z suszoną wołowiną i liofilizowanymi owocami.',
    fieldUse:
      'Dwudniowe trawersy, działania poszukiwawcze, biwakowanie w niskich temperaturach bez możliwości uzupełnienia zapasów.',
    outdoorImage: ration48hOutdoorImg,
    closeupImage: ration48hCloseupImg,
    outdoorAlt: 'MILVITA 48H RATION obok woskowanego plecaka na alpejskiej grani o zmierzchu',
    closeupAlt: 'Rozłożona zawartość MILVITA 48H RATION na ciemnym łupku: 6 dań, herbatniki, jerky i owoce',
    dropStatus: 'DROP 001',
    components: [
      {
        id: '48h-c1',
        name: 'Zestaw 6 dań głównych (2× Gulasz, 2× Kurczak, Curry, Zupa z soczewicy)',
        category: 'Danie główne',
        portionLabel: '6 saszetek × 350 g',
        weightG: 2100,
        proteinG: 172,
        carbsG: 304,
        fatG: 98,
        fiberG: 34,
        ingredients:
          'Dania sterylizowane retortowo: wołowina, mięso drobiowe, ciecierzyca, soczewica czerwona, wędzony boczek, kasza gryczana, ryż, warzywa korzeniowe, przyprawy naturalne.',
        preparation: 'Spożywać na zimno lub podgrzać przez 8–10 min w rękawie FRH.',
      },
      {
        id: '48h-c2',
        name: 'Herbatniki zbożowe wzmacniane',
        category: 'Przekąska',
        portionLabel: '3 pakiety × 120 g',
        weightG: 360,
        proteinG: 32,
        carbsG: 230,
        fatG: 64,
        fiberG: 18,
        ingredients:
          'Mąka pszenna, mąka żytnia pełnoziarnista, tłuszcz roślinny nieutwardzony, ekstrakt słodowy, cukier brązowy, witaminy z grupy B, sól.',
        preparation: 'Ekwiwalent pieczywa do dań głównych lub samodzielna przekąska.',
      },
      {
        id: '48h-c3',
        name: 'Suszone mięso wołowe Beef Jerky (Original & Pepper)',
        category: 'Przekąska',
        portionLabel: '4 saszetki × 40 g',
        weightG: 160,
        proteinG: 88,
        carbsG: 12,
        fatG: 10,
        fiberG: 2,
        ingredients:
          'Chuda wołowina z udźca (92%), sos sojowy bezglutenowy, ocet jabłkowy, czosnek granulowany, czarny pieprz młotkowany, sól peklowa.',
        preparation: 'Wysokobiałkowa przekąska marszowa gotowa do spożycia.',
      },
      {
        id: '48h-c4',
        name: 'Owoce liofilizowane (Malina, Borówka, Jabłko)',
        category: 'Przekąska',
        portionLabel: '2 pakiety × 40 g',
        weightG: 80,
        proteinG: 3,
        carbsG: 66,
        fatG: 1,
        fiberG: 12,
        ingredients: '100% owoce liofilizowane: malina (35%), borówka amerykańska (25%), jabłko krojone (40%).',
        preparation: 'Spożywać na sucho jako źródło naturalnych cukrów i błonnika.',
      },
      {
        id: '48h-c5',
        name: 'Ciemna czekolada 70% kakao',
        category: 'Przekąska',
        portionLabel: '2 tabliczki × 50 g',
        weightG: 100,
        proteinG: 8,
        carbsG: 38,
        fatG: 42,
        fiberG: 10,
        ingredients: 'Miazga kakaowa (70%), cukier trzcinowy, masło kakaowe, lecytyna słonecznikowa.',
        preparation: 'Po 1 tabliczce na dobę działania.',
      },
      {
        id: '48h-c6',
        name: 'Mieszanka orzechów i pestek dyni',
        category: 'Przekąska',
        portionLabel: '2 pakiety × 80 g',
        weightG: 160,
        proteinG: 34,
        carbsG: 28,
        fatG: 80,
        fiberG: 13,
        ingredients: 'Orzechy laskowe, migdały, pestki dyni prażone, orzechy włoskie, sól morska.',
        preparation: 'Gotowe do spożycia.',
      },
      {
        id: '48h-c7',
        name: 'Napój izotoniczny w sztyftach (Pomarańcza & Cytryna)',
        category: 'Hydratacja',
        portionLabel: '6 sztyftów × 25 g',
        weightG: 150,
        proteinG: 0,
        carbsG: 138,
        fatG: 0,
        fiberG: 0,
        ingredients: 'Glukoza, maltodekstryna, sód, potas, magnez, wapń, kwas cytrynowy, aromaty naturalne.',
        preparation: '1 sztyft na 250 ml wody (3 porcje dziennie).',
      },
      {
        id: '48h-c8',
        name: 'Kawa czarna i herbata cytrynowa',
        category: 'Hydratacja',
        portionLabel: 'Pakiet napojów 48H (20 g)',
        weightG: 20,
        proteinG: 0,
        carbsG: 6,
        fatG: 0,
        fiberG: 0,
        ingredients: '2× kawa liofilizowana (3 g), 2× ekstrakt herbaty czarnej z cytryną (7 g).',
        preparation: 'Rozpuścić w 150–200 ml wody.',
      },
      {
        id: '48h-c9',
        name: 'Akcesoria polowe i uzdatnianie wody 48H',
        category: 'Akcesorium',
        portionLabel: '4× FRH, 2× łyżka, 4× tabletka 1L',
        weightG: 130,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        fiberG: 0,
        ingredients:
          '4× podgrzewacz FRH, 2× łyżka długa, 4× tabletki do uzdatniania wody (NaDCC, na 4L), 4× chusteczki odkażające.',
        preparation: '1 tabletka na 1 litr wody, odczekać 30 min przed użyciem.',
      },
    ],
  },
  {
    id: 'prod-72h',
    shopifyVariantId: 'gid://shopify/ProductVariant/4410072003',
    sku: 'MV-D1-72H',
    slug: 'milvita-72h-ration',
    name: 'MILVITA 72H RATION',
    shortTag: '72H / 9 DAŃ + POJEMNIK WODOODPORNY',
    category: 'Racje dobowe',
    durationHours: 72,
    pricePln: 359,
    shelfLifeMonths: 48,
    mealsCount: 9,
    portionsCount: 28,
    packagingWeightG: 420,
    waterRequiredMl: 2000,
    summary:
      'Pełny pakiet przetrwania na 72 godziny w wodoodpornym, wielokrotnego użytku pojemniku ekspedycyjnym. Najwyższa gęstość energetyczna w ofercie Drop 001.',
    fieldUse:
      'Ekspedycje trzydniowe, zabezpieczenie załóg pojazdów terenowych, bazowy pakiet kryzysowy 72H odporny na zgniatanie i zalanie.',
    outdoorImage: ration72hOutdoorImg,
    closeupImage: ration72hCloseupImg,
    outdoorAlt: 'Wodoodporna skrzynia MILVITA 72H RATION na mchu leśnym obok plandeki i kijków trekkingowych',
    closeupAlt: 'Kompletna zawartość MILVITA 72H RATION: 9 dań, bloki awaryjne 2400 kcal, mięso, orzechy i podgrzewacze',
    dropStatus: 'LIMITOWANA PARTIA',
    components: [
      {
        id: '72h-c1',
        name: '3× Śniadanie energetyczne (Granola, Owsianka z cukrem trzcinowym, Owsianka jagodowa)',
        category: 'Danie główne',
        portionLabel: '3 saszetki × 150 g',
        weightG: 450,
        proteinG: 45,
        carbsG: 285,
        fatG: 60,
        fiberG: 27,
        ingredients:
          'Płatki owsiane, mleko pełne w proszku, jagody liofilizowane, migdały, cukier trzcinowy, nasiona chia, sól.',
        preparation: 'Zalać 150 ml gorącej lub zimnej wody bezpośrednio do saszetki, odczekać 5 min.',
      },
      {
        id: '72h-c2',
        name: '3× Danie obiadowe (Gulasz wołowy, Chili Mac, Warzywne ragout)',
        category: 'Danie główne',
        portionLabel: '3 saszetki × 350 g',
        weightG: 1050,
        proteinG: 90,
        carbsG: 150,
        fatG: 48,
        fiberG: 21,
        ingredients:
          'Wołowina, fasola czerwona, makaron, pomidory, soczewica, warzywa korzeniowe, olej rzepakowy, przyprawy.',
        preparation: 'Gotowe do spożycia lub do podgrzania w podgrzewaczu FRH.',
      },
      {
        id: '72h-c3',
        name: '3× Kolacja regeneracyjna (Kurczak z ryżem, Spaghetti bolognese, Zupa gulaszowa)',
        category: 'Danie główne',
        portionLabel: '3 saszetki × 350 g',
        weightG: 1050,
        proteinG: 87,
        carbsG: 156,
        fatG: 45,
        fiberG: 18,
        ingredients:
          'Mięso drobiowe, wołowina, ryż, makaron durum, koncentrat pomidorowy, papryka, cebula, zioła.',
        preparation: 'Spożywać na ciepło po podgrzaniu w FRH lub bezpośrednio na zimno.',
      },
      {
        id: '72h-c4',
        name: 'Kompresowane bloki awaryjne 2400',
        category: 'Przekąska',
        portionLabel: '2 bloki × 250 g',
        weightG: 500,
        proteinG: 48,
        carbsG: 312,
        fatG: 112,
        fiberG: 16,
        ingredients:
          'Mąka pszenna prażona, tłuszcz roślinny stabilizowany, cukier, białko mleka, witaminy A, D, E, C, B1, B2, B6.',
        preparation: 'Racja rezerwowa o 4-letniej trwałości. Spożywać porcjami po 60 g z wodą.',
      },
      {
        id: '72h-c5',
        name: 'Suszone mięso i wędzony łosoś w folii',
        category: 'Przekąska',
        portionLabel: '3 pakiety × 60 g',
        weightG: 180,
        proteinG: 78,
        carbsG: 8,
        fatG: 24,
        fiberG: 0,
        ingredients:
          'Wołowina suszona, indyk suszony, filet z łososia pacyficznego wędzony na zimno, sól morska, pieprz.',
        preparation: 'Gotowe do bezpośredniego spożycia.',
      },
      {
        id: '72h-c6',
        name: 'Pakiety orzechów wysokotłuszczowych',
        category: 'Przekąska',
        portionLabel: '4 saszetki × 75 g',
        weightG: 300,
        proteinG: 62,
        carbsG: 52,
        fatG: 154,
        fiberG: 24,
        ingredients:
          'Orzechy makadamia, migdały, orzechy włoskie, orzechy brazylijskie, pestki dyni.',
        preparation: 'Wysokoenergetyczny dodatek tłuszczowy na nocne ochłodzenie.',
      },
      {
        id: '72h-c7',
        name: 'Napój elektrolitowy w saszetkach',
        category: 'Hydratacja',
        portionLabel: '6 saszetek × 25 g',
        weightG: 150,
        proteinG: 0,
        carbsG: 138,
        fatG: 0,
        fiberG: 0,
        ingredients: 'Węglowodany proste i złożone, chlorek sodu, cytrynian potasu, mleczan magnezu.',
        preparation: '1 saszetka na 300 ml wody.',
      },
      {
        id: '72h-c8',
        name: 'Pakiet kawy, herbaty i przypraw 72H',
        category: 'Hydratacja',
        portionLabel: 'Pakiet zbiorczy (40 g)',
        weightG: 40,
        proteinG: 0,
        carbsG: 28,
        fatG: 0,
        fiberG: 0,
        ingredients: '3× kawa rozpuszczalna, 3× herbata czarna, 6× cukier trzcinowy, sól, chili.',
        preparation: 'Zalewać gorącą lub letnią wodą.',
      },
      {
        id: '72h-c9',
        name: 'Moduł grzewczy, uzdatnianie wody i narzędzia 72H',
        category: 'Akcesorium',
        portionLabel: '6× FRH, 10× tab. 1L, łyżka, zapałki',
        weightG: 160,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        fiberG: 0,
        ingredients:
          '6× podgrzewacz FRH, 10× tabletka do uzdatniania wody (10L), łyżka tytanowo-polimerowa, zapałki sztormowe.',
        preparation: 'Pojemnik zewnętrzny służy po opróżnieniu do transportu sprzętu.',
      },
    ],
  },
  {
    id: 'prod-energy',
    shopifyVariantId: 'gid://shopify/ProductVariant/4410099004',
    sku: 'MV-D1-ENG',
    slug: 'milvita-energy-pack',
    name: 'MILVITA ENERGY PACK',
    shortTag: 'AWARYJNY PAKIET WYSOKOKALORYCZNY',
    category: 'Pakiety energetyczne',
    durationHours: 12,
    pricePln: 49,
    shelfLifeMonths: 48,
    mealsCount: 0,
    portionsCount: 4,
    packagingWeightG: 20,
    waterRequiredMl: 250,
    summary:
      'Skondensowany pakiet awaryjny mieszczący się w kieszeni cargo. Ponad 1400 kcal w 320 gramach masy całkowitej — bez gotowania i bez użycia sprzętu.',
    fieldUse:
      'Rezerwa bezpieczeństwa do kurtki lub uprzęży, szybkie uzupełnienie deficytu energetycznego w trakcie podejścia i w warunkach awaryjnych.',
    outdoorImage: energyPackOutdoorImg,
    closeupImage: energyPackCloseupImg,
    outdoorAlt: 'MILVITA ENERGY PACK na wapiennej półce skalnej nad górską doliną',
    closeupAlt: 'Przekrój batonów owsiano-sezamowych i bloku gorzkiej czekolady z MILVITA ENERGY PACK',
    dropStatus: 'DROP 001',
    components: [
      {
        id: 'eng-c1',
        name: 'Skondensowany baton owsiano-sezamowo-orzechowy',
        category: 'Przekąska',
        portionLabel: '2 bloki × 100 g',
        weightG: 200,
        proteinG: 26,
        carbsG: 98,
        fatG: 54,
        fiberG: 16,
        ingredients:
          'Płatki owsiane prażone (38%), pasta z orzeszków ziemnych (24%), ziarno sezamu (18%), miód gryczany, olej rzepakowy, sól morska.',
        preparation: 'Gotowe do spożycia w każdej temperaturze (od -20°C do +40°C).',
      },
      {
        id: 'eng-c2',
        name: 'Blok ciemnego kakao 70% z solą morską',
        category: 'Przekąska',
        portionLabel: '1 tabliczka (50 g)',
        weightG: 50,
        proteinG: 4,
        carbsG: 19,
        fatG: 21,
        fiberG: 5,
        ingredients: 'Miazga kakaowa 70%, cukier trzcinowy, masło kakaowe, sól morska kryształki.',
        preparation: 'Spożywać jako źródło lipidów i teobrominy.',
      },
      {
        id: 'eng-c3',
        name: 'Tabletki glukozowe z magnezem i witaminą C',
        category: 'Przekąska',
        portionLabel: '10 tabletek (30 g)',
        weightG: 30,
        proteinG: 0,
        carbsG: 28,
        fatG: 0,
        fiberG: 0,
        ingredients: 'Dekstroza (93%), cytrynian magnezu, kwas L-askorbinowy, naturalny aromat cytrynowy.',
        preparation: 'Szybka podaż glukozy przy nagłym spadku sił.',
      },
      {
        id: 'eng-c4',
        name: 'Saszetka elektrolitowa szybkowchłanialna',
        category: 'Hydratacja',
        portionLabel: '1 saszetka (20 g)',
        weightG: 20,
        proteinG: 0,
        carbsG: 18,
        fatG: 0,
        fiberG: 0,
        ingredients: 'Glukoza, chlorek sodu, cytrynian potasu, witaminy B6 i B12.',
        preparation: 'Rozpuścić w 250 ml wody.',
      },
    ],
  },
  {
    id: 'prod-field',
    shopifyVariantId: 'gid://shopify/ProductVariant/4410120005',
    sku: 'MV-D1-FLD',
    slug: 'milvita-field-kit',
    name: 'MILVITA FIELD KIT',
    shortTag: 'KOMPAKTOWY ZESTAW AKTYWNOŚCIOWY',
    category: 'Zestawy terenowe',
    durationHours: 16,
    pricePln: 89,
    shelfLifeMonths: 36,
    mealsCount: 2,
    portionsCount: 5,
    packagingWeightG: 68,
    waterRequiredMl: 500,
    summary:
      'Lekki, rolowany zestaw terenowy na jednodniowe wyjścia górskie, biwak lub długie trasy rowerowe. Dwa pełne posiłki, mieszanka szlakowa i nawodnienie.',
    fieldUse:
      'Trekking lekki, bikepacking, całodniowe wyjścia leśne. Zmieści się w kieszeni bocznej plecaka o pojemności 15L.',
    outdoorImage: fieldKitOutdoorImg,
    closeupImage: fieldKitCloseupImg,
    outdoorAlt: 'Kompaktowy worek MILVITA FIELD KIT obok tytanowego kubka i palnika na leśnej ściółce',
    closeupAlt: 'Elementy MILVITA FIELD KIT na lnianym płótnie: dwa dania, mieszanka orzechów i żurawiny, izotoniki i espresso',
    dropStatus: 'DROP 001',
    components: [
      {
        id: 'fld-c1',
        name: 'Chili con carne z czerwoną fasolą',
        category: 'Danie główne',
        portionLabel: '1 lekka saszetka (300 g)',
        weightG: 300,
        proteinG: 24,
        carbsG: 42,
        fatG: 14,
        fiberG: 9,
        ingredients:
          'Wołowina mielona (32%), fasola czerwona (28%), pomidory krojone, kukurydza, papryka chili, kmin rzymski, cebula, olej.',
        preparation: 'Podgrzać w garnku z wodą lub spożyć bezpośrednio po otwarciu.',
      },
      {
        id: 'fld-c2',
        name: 'Gulasz z soczewicy i warzyw korzeniowych',
        category: 'Danie główne',
        portionLabel: '1 lekka saszetka (300 g)',
        weightG: 300,
        proteinG: 20,
        carbsG: 46,
        fatG: 11,
        fiberG: 11,
        ingredients:
          'Soczewica zielona i czerwona (42%), marchew, pietruszka, ziemniaki, seler, bulion warzywny, oliwa z oliwek, tymianek.',
        preparation: 'Gotowe do spożycia lub do szybkiego podgrzania.',
      },
      {
        id: 'fld-c3',
        name: 'Mieszanka szlakowa (Migdały, Żurawina, Orzechy, Pestki)',
        category: 'Przekąska',
        portionLabel: '1 pakiet z zipem (120 g)',
        weightG: 120,
        proteinG: 22,
        carbsG: 40,
        fatG: 48,
        fiberG: 9,
        ingredients:
          'Migdały surowe (30%), żurawina suszona (30%), orzechy włoskie (20%), pestki dyni prażone (20%).',
        preparation: 'Zamykane strunowo opakowanie do podjadania w ruchu.',
      },
      {
        id: 'fld-c4',
        name: 'Izotonik w sztyfcie (Pomarańcza & Cytryna-Limonka)',
        category: 'Hydratacja',
        portionLabel: '2 sztyfty × 24 g',
        weightG: 48,
        proteinG: 0,
        carbsG: 44,
        fatG: 0,
        fiberG: 0,
        ingredients: 'Dekstroza, maltodekstryna, elektrolity (Na, K, Mg), kwas cytrynowy, aromaty.',
        preparation: '1 sztyft na 250 ml wody w bidonie.',
      },
      {
        id: 'fld-c5',
        name: 'Espresso organiczne w saszetce',
        category: 'Hydratacja',
        portionLabel: '1 saszetka (4 g)',
        weightG: 4,
        proteinG: 0,
        carbsG: 1,
        fatG: 0,
        fiberG: 0,
        ingredients: '100% drobno mielona kawa rozpuszczalna typu espresso.',
        preparation: 'Zalać 100 ml gorącej wody.',
      },
    ],
  },
];

export interface PrototypeStage {
  version: string;
  date: string;
  title: string;
  changes: string[];
  outcome: string;
}

export const PROTOTYPE_EVOLUTION: PrototypeStage[] = [
  {
    version: 'PROTOTYP V1',
    date: 'Q4 2025',
    title: 'Założenia bazowe i pierwsza mieszanka liofilizowana',
    changes: [
      'Zbyt wysoki udział cukrów prostych powodował szybki spadek glikemii po 90 minutach marszu.',
      'Opakowanie jednowarstwowe traciło elastyczność przy -10°C i pękało na zgrzewach.',
      'Brak bezpośredniej możliwości jedzenia dań głównych bez dostępu do wrzątku.',
    ],
    outcome: 'Odrzucono koncepcję wyłącznie liofilizowaną dla racji taktycznych 24H–72H.',
  },
  {
    version: 'PROTOTYP V2',
    date: 'Q1 2026',
    title: 'Przejście na sterylizowane saszetki retortowe i korekta makro',
    changes: [
      'Wprowadzono gotowe dania retortowe niewymagające dolewania wody do posiłku.',
      'Zredukowano zawartość sodu w daniach o 18%, przenosząc uzupełnianie elektrolitów do saszetek izotonicznych.',
      'Zmieniono strukturę batonów owsianych: dodano tłuszcz kokosowy i orzechy dla miękkości w mrozie.',
    ],
    outcome: 'Zadowalająca kaloryczność, lecz masa całkowita racji 24H przekraczała 1,85 kg.',
  },
  {
    version: 'PROTOTYP V3',
    date: 'Q2 2026',
    title: 'Redukcja masy laminatu i optymalizacja gęstości energetycznej',
    changes: [
      'Zastosowano 4-warstwowy laminat barierowy AL/PE o grubości zmniejszonej o 22% przy zachowaniu pełnej szczelności.',
      'Wycięto zbędne przekąski objętościowe na rzecz orzechów wysokotłuszczowych i czekolady 70%.',
      'Przeprojektowano nacięcia łatwego otwierania (tear-notch) pod obsługę w grubych rękawicach.',
    ],
    outcome: 'Spadek masy brutto 24H do 1,60 kg przy utrzymaniu ponad 3360 kcal.',
  },
  {
    version: 'WERSJA DROP 001',
    date: 'Q4 2026',
    title: 'Specyfikacja finalna gotowa do pakowania',
    changes: [
      'Pełna spójność wagowa wszystkich komponentów: każda kaloria pełni określoną funkcję metaboliczną.',
      'Podział na 5 autonomicznych modułów: 24H, 48H, 72H, Energy Pack oraz Field Kit.',
      'Wdrożono bezpłomieniowe podgrzewacze FRH o stabilnym czasie reakcji 8 minut.',
    ],
    outcome: 'Zatwierdzono do krótkiej partii premierowej DROP 001.',
  },
];

export interface FieldTestLog {
  id: string;
  blockCode: string;
  location: string;
  duration: string;
  conditions: string;
  metrics: {
    label: string;
    value: string;
  }[];
  finding: string;
}

export const FIELD_TESTS: FieldTestLog[] = [
  {
    id: 'ft-1',
    blockCode: 'TEST POLOWY 01',
    location: 'Beskid Żywiecki · Pilsko',
    duration: '72 godziny ciągiem',
    conditions: '-8°C do -2°C, wiatr 55 km/h, pokrywa śnieżna 80 cm',
    metrics: [
      { label: 'Średni czas otwarcia rękawicą', value: '4.2 s' },
      { label: 'Czas reakcji FRH przy -6°C', value: '9 min 15 s' },
      { label: 'Deficyt kaloryczny marszu 26 km/d', value: '< 12%' },
    ],
    finding:
      'Batony zachowały strukturę żujną w temperaturze -8°C. Składanie odpadów z powrotem do saszetki głównej zredukowało objętość śmieci o 60%.',
  },
  {
    id: 'ft-2',
    blockCode: 'TEST POLOWY 02',
    location: 'Wybrzeże Bałtyckie · Pas Nadmorski',
    duration: '48 godzin',
    conditions: '+4°C, ciągły opad deszczu, wilgotność 96%',
    metrics: [
      { label: 'Szczelność po 6h zanurzenia', value: '100% sucho' },
      { label: 'Rozpuszczalność izotoniku', value: '22 s w zimnej wodzie' },
      { label: 'Tolerancja żołądkowa w wysiłku', value: 'Brak dyskomfortu' },
    ],
    finding:
      'Laminat barierowy oraz karton powlekany 48H nie uległy rozwarstwieniu mimo wielogodzinnej ekspozycji na deszcz i słoną wodę.',
  },
  {
    id: 'ft-3',
    blockCode: 'TEST POLOWY 03',
    location: 'Tatry Zachodnie · Grań',
    duration: '24 godziny (marsz wymuszony)',
    conditions: '+1°C do +11°C, przewyższenie +1950 m, 34 km dystansu',
    metrics: [
      { label: 'Spożycie na zimno (bez grzania)', value: '2 z 3 dań głównych' },
      { label: 'Masa netto na 1000 kcal', value: '434 g' },
      { label: 'Wykorzystanie wody z racji', value: '500 ml / 24h' },
    ],
    finding:
      'Dania retortowe o umiarkowanej gęstości tłuszczu były w pełni akceptowalne na zimno podczas krótkich przerw graniowych.',
  },
];
