import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, ArrowLeft, Star, GraduationCap, AudioLines, Search, Volume2, Mic, Square, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import GermanTracingCanvas from './GermanTracingCanvas';
import { GermanFontStyle } from '../types';
import SquirrelMascot from './SquirrelMascot';

interface GermanGameProps {
  onBack: () => void;
  onBonus: () => void;
  learnedLetters: string[];
  fontStyle: GermanFontStyle;
  score: number;
  onScoreChange: (amount: number) => void;
  onCorrectAnswer?: () => void;
  adventureMathSolved?: number;
  adventureGermanSolved?: number;
}

type GermanTaskType = 'ARTICLE' | 'SYLLABLES' | 'VOICE_READING' | 'TRACING';

interface GermanWord {
  word: string;
  article: 'Der' | 'Die' | 'Das';
  syllables: number;
}

const ALL_WORDS: GermanWord[] = [
  { word: 'Haus', article: 'Das', syllables: 1 },
  { word: 'Apfel', article: 'Der', syllables: 2 },
  { word: 'Schule', article: 'Die', syllables: 2 },
  { word: 'Buch', article: 'Das', syllables: 1 },
  { word: 'Hund', article: 'Der', syllables: 1 },
  { word: 'Katze', article: 'Die', syllables: 2 },
  { word: 'Baum', article: 'Der', syllables: 1 },
  { word: 'Blume', article: 'Die', syllables: 2 },
  { word: 'Auto', article: 'Das', syllables: 2 },
  { word: 'Kind', article: 'Das', syllables: 1 },
  { word: 'Stift', article: 'Der', syllables: 1 },
  { word: 'Tisch', article: 'Der', syllables: 1 },
  { word: 'Lampe', article: 'Die', syllables: 2 },
  { word: 'Sonne', article: 'Die', syllables: 2 },
  { word: 'Mond', article: 'Der', syllables: 1 },
  { word: 'Stern', article: 'Der', syllables: 1 },
  { word: 'Vogel', article: 'Der', syllables: 2 },
  { word: 'Fisch', article: 'Der', syllables: 1 },
  { word: 'Maus', article: 'Die', syllables: 1 },
  { word: 'Eis', article: 'Das', syllables: 1 },
  { word: 'Brot', article: 'Das', syllables: 1 },
  { word: 'Milch', article: 'Die', syllables: 1 },
  { word: 'Wasser', article: 'Das', syllables: 2 },
  { word: 'Banane', article: 'Die', syllables: 3 },
  { word: 'Birne', article: 'Die', syllables: 2 },
  { word: 'Nase', article: 'Die', syllables: 2 },
  { word: 'Auge', article: 'Das', syllables: 2 },
  { word: 'Ohr', article: 'Das', syllables: 1 },
  { word: 'Mund', article: 'Der', syllables: 1 },
  { word: 'Hand', article: 'Die', syllables: 1 },
  { word: 'Fuß', article: 'Der', syllables: 1 },
  { word: 'Kopf', article: 'Der', syllables: 1 },
  { word: 'Bein', article: 'Das', syllables: 1 },
  { word: 'Sofa', article: 'Das', syllables: 2 },
  { word: 'Bett', article: 'Das', syllables: 1 },
  { word: 'Stuhl', article: 'Der', syllables: 1 },
  { word: 'Schrank', article: 'Der', syllables: 1 },
  { word: 'Tür', article: 'Die', syllables: 1 },
  { word: 'Fenster', article: 'Das', syllables: 2 },
  { word: 'Aprikose', article: 'Die', syllables: 4 },
  { word: 'Elefant', article: 'Der', syllables: 3 },
  { word: 'Igel', article: 'Der', syllables: 2 },
  { word: 'Uhu', article: 'Der', syllables: 2 },
  { word: 'Traube', article: 'Die', syllables: 2 },
  { word: 'Kiwi', article: 'Die', syllables: 2 },
  { word: 'Zitrone', article: 'Die', syllables: 3 },
  { word: 'Melone', article: 'Die', syllables: 3 },
  { word: 'Tomate', article: 'Die', syllables: 3 },
  { word: 'Gurke', article: 'Die', syllables: 2 },
  { word: 'Paprika', article: 'Die', syllables: 3 },
  { word: 'Käse', article: 'Der', syllables: 2 },
  { word: 'Wurst', article: 'Die', syllables: 1 },
  { word: 'Butter', article: 'Die', syllables: 2 },
  { word: 'Zucker', article: 'Der', syllables: 2 },
  { word: 'Salz', article: 'Das', syllables: 1 },
  { word: 'Pfeffer', article: 'Der', syllables: 2 },
  { word: 'Honig', article: 'Der', syllables: 2 },
  { word: 'Marmelade', article: 'Die', syllables: 4 },
  { word: 'Saft', article: 'Der', syllables: 1 },
  { word: 'Tee', article: 'Der', syllables: 1 },
  { word: 'Kaffee', article: 'Der', syllables: 2 },
  { word: 'Limonade', article: 'Die', syllables: 4 },
  { word: 'Cola', article: 'Die', syllables: 2 },
  { word: 'Gitarre', article: 'Die', syllables: 3 },
  { word: 'Klavier', article: 'Das', syllables: 2 },
  { word: 'Trommel', article: 'Die', syllables: 2 },
  { word: 'Flöte', article: 'Die', syllables: 2 },
  { word: 'Geige', article: 'Die', syllables: 2 },
  { word: 'Ball', article: 'Der', syllables: 1 },
  { word: 'Puppe', article: 'Die', syllables: 2 },
  { word: 'Teddy', article: 'Der', syllables: 2 },
  { word: 'Auto', article: 'Das', syllables: 2 },
  { word: 'Zug', article: 'Der', syllables: 1 },
  { word: 'Schiff', article: 'Das', syllables: 1 },
  { word: 'Flugzeug', article: 'Das', syllables: 2 },
  { word: 'Hubschrauber', article: 'Der', syllables: 4 },
  { word: 'Fahrrad', article: 'Das', syllables: 2 },
  { word: 'Roller', article: 'Der', syllables: 2 },
  { word: 'Helm', article: 'Der', syllables: 1 },
  { word: 'Jacke', article: 'Die', syllables: 2 },
  { word: 'Hose', article: 'Die', syllables: 2 },
  { word: 'Hemd', article: 'Das', syllables: 1 },
  { word: 'Kleid', article: 'Das', syllables: 1 },
  { word: 'Rock', article: 'Der', syllables: 1 },
  { word: 'Schuh', article: 'Der', syllables: 1 },
  { word: 'Socke', article: 'Die', syllables: 2 },
  { word: 'Mütze', article: 'Die', syllables: 2 },
  { word: 'Handschuh', article: 'Der', syllables: 2 },
  { word: 'Brille', article: 'Die', syllables: 2 },
  { word: 'Uhr', article: 'Die', syllables: 1 },
  { word: 'Ring', article: 'Der', syllables: 1 },
  { word: 'Kette', article: 'Die', syllables: 2 },
  { word: 'Tasche', article: 'Die', syllables: 2 },
  { word: 'Rucksack', article: 'Der', syllables: 2 },
  { word: 'Koffer', article: 'Der', syllables: 2 },
  { word: 'Regenschirm', article: 'Der', syllables: 3 },
  { word: 'Hammer', article: 'Der', syllables: 2 },
  { word: 'Säge', article: 'Die', syllables: 2 },
  { word: 'Zange', article: 'Die', syllables: 2 },
  { word: 'Besen', article: 'Der', syllables: 2 },
  { word: 'Eimer', article: 'Der', syllables: 2 },
  { word: 'Schaufel', article: 'Die', syllables: 2 },
  { word: 'Gabel', article: 'Die', syllables: 2 },
  { word: 'Löffel', article: 'Der', syllables: 2 },
  { word: 'Messer', article: 'Das', syllables: 2 },
  { word: 'Teller', article: 'Der', syllables: 2 },
  { word: 'Tasse', article: 'Die', syllables: 2 },
  { word: 'Glas', article: 'Das', syllables: 1 },
  { word: 'Pfanne', article: 'Die', syllables: 2 },
  { word: 'Topf', article: 'Der', syllables: 1 },
  { word: 'Schmetterling', article: 'Der', syllables: 3 },
  { word: 'Sonnenblume', article: 'Die', syllables: 4 },
  { word: 'Eisenbahn', article: 'Die', syllables: 3 },
  { word: 'Feuerwehr', article: 'Die', syllables: 3 },
  { word: 'Polizei', article: 'Die', syllables: 3 },
  { word: 'Kinderwagen', article: 'Der', syllables: 4 },
  { word: 'Regenbogen', article: 'Der', syllables: 4 },
  { word: 'Krokodil', article: 'Das', syllables: 3 },
  { word: 'Dinosaurier', article: 'Der', syllables: 5 },
  { word: 'Astronaut', article: 'Der', syllables: 3 },
  { word: 'Abenteuer', article: 'Das', syllables: 4 },
  { word: 'Geschenkpapier', article: 'Das', syllables: 4 },
  { word: 'Erdbeere', article: 'Die', syllables: 3 },
  { word: 'Himbeere', article: 'Die', syllables: 3 },
  { word: 'Johannisbeere', article: 'Die', syllables: 5 },
  { word: 'Karotte', article: 'Die', syllables: 3 },
  { word: 'Aubergine', article: 'Die', syllables: 4 },
  { word: 'Brokkoli', article: 'Der', syllables: 3 },
  { word: 'Blumenkohl', article: 'Der', syllables: 3 },
  { word: 'Spaghetti', article: 'Die', syllables: 3 },
  { word: 'Schokolade', article: 'Die', syllables: 4 },
  { word: 'Gummibärchen', article: 'Das', syllables: 4 },
  { word: 'Kindergarten', article: 'Der', syllables: 4 },
  { word: 'Ferien', article: 'Die', syllables: 3 },
  { word: 'Marienkäfer', article: 'Der', syllables: 5 },
  { word: 'Taschenlampe', article: 'Die', syllables: 4 },
  { word: 'Fledermaus', article: 'Die', syllables: 3 },
  { word: 'Papagei', article: 'Der', syllables: 3 },
  { word: 'Pinguin', article: 'Der', syllables: 3 },
  { word: 'Eichhörnchen', article: 'Das', syllables: 3 },
  { word: 'Schildkröte', article: 'Die', syllables: 3 },
  { word: 'Libelle', article: 'Die', syllables: 3 },
  { word: 'Achterbahn', article: 'Die', syllables: 3 },
  { word: 'Karussell', article: 'Das', syllables: 3 },
  { word: 'Baustelle', article: 'Die', syllables: 3 },
  { word: 'Krankenwagen', article: 'Der', syllables: 4 },
  { word: 'Müllabfuhr', article: 'Die', syllables: 3 },
  { word: 'Lastwagen', article: 'Der', syllables: 3 },
  { word: 'Straßenbahn', article: 'Die', syllables: 3 },
  { word: 'Kaugummi', article: 'Das', syllables: 3 },
  { word: 'Feuerwerk', article: 'Das', syllables: 3 },
  { word: 'Karneval', article: 'Der', syllables: 3 },
  { word: 'Zirkuszelt', article: 'Das', syllables: 3 },
  { word: 'Luftballon', article: 'Der', syllables: 3 },
  { word: 'Seifenblase', article: 'Die', syllables: 4 },
  { word: 'Geschenkkorb', article: 'Der', syllables: 3 },
  { word: 'Delfin', article: 'Der', syllables: 2 },
  { word: 'Giraffe', article: 'Die', syllables: 3 },
  { word: 'Zebra', article: 'Das', syllables: 2 },
  { word: 'Löwe', article: 'Der', syllables: 2 },
  { word: 'Tiger', article: 'Der', syllables: 2 },
  { word: 'Bär', article: 'Der', syllables: 1 },
  { word: 'Affe', article: 'Der', syllables: 2 },
  { word: 'Haifisch', article: 'Der', syllables: 2 },
  { word: 'Walross', article: 'Das', syllables: 2 },
  { word: 'Nashorn', article: 'Das', syllables: 2 },
  { word: 'Flusspferd', article: 'Das', syllables: 2 },
  { word: 'Känguru', article: 'Das', syllables: 3 },
  { word: 'Koala', article: 'Der', syllables: 3 },
  { word: 'Kamel', article: 'Das', syllables: 2 },
  { word: 'Esel', article: 'Der', syllables: 2 },
  { word: 'Pferd', article: 'Das', syllables: 1 },
  { word: 'Schaf', article: 'Das', syllables: 1 },
  { word: 'Ziege', article: 'Die', syllables: 2 },
  { word: 'Schwein', article: 'Das', syllables: 1 },
  { word: 'Huhn', article: 'Das', syllables: 1 },
  { word: 'Hahn', article: 'Der', syllables: 1 },
  { word: 'Küken', article: 'Das', syllables: 2 },
  { word: 'Ente', article: 'Die', syllables: 2 },
  { word: 'Gans', article: 'Die', syllables: 1 },
  { word: 'Schwan', article: 'Der', syllables: 1 },
  { word: 'Rabe', article: 'Der', syllables: 2 },
  { word: 'Krähe', article: 'Die', syllables: 2 },
  { word: 'Eule', article: 'Die', syllables: 2 },
  { word: 'Specht', article: 'Der', syllables: 1 },
  { word: 'Kuckuck', article: 'Der', syllables: 2 },
  { word: 'Käfer', article: 'Der', syllables: 2 },
  { word: 'Fliege', article: 'Die', syllables: 2 },
  { word: 'Mücke', article: 'Die', syllables: 2 },
  { word: 'Biene', article: 'Die', syllables: 2 },
  { word: 'Wespe', article: 'Die', syllables: 2 },
  { word: 'Hummel', article: 'Die', syllables: 2 },
  { word: 'Ameise', article: 'Die', syllables: 3 },
  { word: 'Spinne', article: 'Die', syllables: 2 },
  { word: 'Schnecke', article: 'Die', syllables: 2 },
  { word: 'Wurm', article: 'Der', syllables: 1 },
  { word: 'Frosch', article: 'Der', syllables: 1 },
  { word: 'Kröte', article: 'Die', syllables: 2 },
  { word: 'Molch', article: 'Der', syllables: 1 },
  { word: 'Eidechse', article: 'Die', syllables: 3 },
  { word: 'Schlange', article: 'Die', syllables: 2 },
  { word: 'Schild', article: 'Der', syllables: 1 },
  { word: 'Krabbe', article: 'Die', syllables: 2 },
  { word: 'Qualle', article: 'Die', syllables: 2 },
  { word: 'Seestern', article: 'Der', syllables: 2 },
  { word: 'Muschel', article: 'Die', syllables: 2 },
  { word: 'Krake', article: 'Der', syllables: 2 },
  { word: 'Tintenfisch', article: 'Der', syllables: 3 },
  { word: 'Dinosaurier', article: 'Der', syllables: 5 },
  { word: 'Hubschrauber', article: 'Der', syllables: 3 },
  { word: 'Regenbogen', article: 'Der', syllables: 4 },
  { word: 'U-Boot', article: 'Das', syllables: 2 },
  { word: 'Traktor', article: 'Der', syllables: 2 },
  { word: 'Schatzkiste', article: 'Die', syllables: 3 },
  { word: 'Lupe', article: 'Die', syllables: 2 },
  { word: 'Kompass', article: 'Der', syllables: 2 },
  { word: 'Rucksack', article: 'Der', syllables: 2 },
  { word: 'Zelt', article: 'Das', syllables: 1 },
  { word: 'Gitarre', article: 'Die', syllables: 3 },
  { word: 'Flöte', article: 'Die', syllables: 2 },
  { word: 'Trommel', article: 'Die', syllables: 2 },
  { word: 'Klavier', article: 'Das', syllables: 2 },
  { word: 'Geige', article: 'Die', syllables: 2 },
  { word: 'Krone', article: 'Die', syllables: 2 },
  { word: 'Zauberstab', article: 'Der', syllables: 3 },
  { word: 'Burg', article: 'Die', syllables: 1 },
  { word: 'Ritter', article: 'Der', syllables: 2 },
  { word: 'Prinzessin', article: 'Die', syllables: 3 },
  { word: 'König', article: 'Der', syllables: 2 },
  { word: 'Pirat', article: 'Der', syllables: 2 },
  { word: 'Säbel', article: 'Der', syllables: 2 },
  { word: 'Insel', article: 'Die', syllables: 2 },
  { word: 'Meerjungfrau', article: 'Die', syllables: 3 },
  { word: 'Leuchtturm', article: 'Der', syllables: 2 },
  { word: 'U-Bahn', article: 'Die', syllables: 2 },
  { word: 'Fahrrad', article: 'Das', syllables: 2 },
  { word: 'Motorrad', article: 'Das', syllables: 3 },
  { word: 'Rakete', article: 'Die', syllables: 3 },
  { word: 'Astronaut', article: 'Der', syllables: 3 },
  { word: 'Planet', article: 'Der', syllables: 2 },
  { word: 'Komet', article: 'Der', syllables: 2 },
  { word: 'Teleskop', article: 'Das', syllables: 3 },
  { word: 'Sternbild', article: 'Das', syllables: 2 },
];

const ALL_SENTENCES = [
  "Malin fliegt zum Mond.",
  "Anni fliegt zum Mond.",
  "Jakob isst süßes Eis.",
  "Anni isst süßes Eis.",
  "Julia tanzt im Zimmer.",
  "Anni tanzt im Zimmer.",
  "Eva sucht den Ball.",
  "Anni sucht den Ball.",
  "Mila mag Gummibärchen.",
  "Anni mag Gummibärchen.",
  "Sarah ruft das Eichhörnchen.",
  "Anni ruft das Eichhörnchen.",
  "Malin isst eine Pizza.",
  "Anni isst eine Pizza.",
  "Jakob fliegt weit weg.",
  "Anni fliegt weit weg.",
  "Julia springt sehr hoch.",
  "Anni springt sehr hoch.",
  "Eva singt ein Lied.",
  "Anni singt ein Lied.",
  "Mila spielt Fußball.",
  "Anni spielt Fußball.",
  "Sarah trinkt Limonade.",
  "Anni trinkt Limonade.",
  "Malin schläft im Bett.",
  "Anni schläft im Bett.",
  "Jakob sucht den Schuh.",
  "Anni sucht den Schuh.",
  "Mila reitet auf dem Teppich.",
  "Anni reitet auf dem Teppich.",
  "Sarah tanzt im Regen.",
  "Anni tanzt im Regen.",
  "Malin baut ein Haus.",
  "Anni baut ein Haus.",
  "Jakob spielt im Garten.",
  "Anni spielt im Garten.",
  "Julia fliegt im Ballon.",
  "Anni fliegt im Ballon.",
  "Eva sucht einen Geist.",
  "Anni sucht einen Geist.",
  "Mila singt sehr laut.",
  "Anni singt sehr laut.",
  "Sarah fährt Skateboard.",
  "Anni fährt Skateboard.",
  "Malin findet einen Stern.",
  "Anni findet einen Stern.",
  "Jakob kitzelt den Drachen.",
  "Anni kitzelt den Drachen.",
  "Julia springt in die Pfütze.",
  "Anni springt in die Pfütze.",
  "Eva baut einen Schneemann.",
  "Anni baut einen Schneemann.",
  "Mila sieht eine Maus.",
  "Anni sieht eine Maus.",
  "Sarah schläft auf der Wolke.",
  "Anni schläft auf der Wolke.",
  "Malin findet einen Schatz.",
  "Anni findet einen Schatz.",
  "Jakob fliegt zu den Dinos.",
  "Anni fliegt zu den Dinos.",
  "Mila badet im Pool.",
  "Anni badet im Pool.",
  "Malin füttert den Elefanten.",
  "Anni füttert den Elefanten.",
  "Jakob baut eine Rutsche.",
  "Anni baut eine Rutsche.",
  "Eva fliegt mit dem Vogel.",
  "Anni fliegt mit dem Vogel.",
  "Sarah balanciert ein Törtchen.",
  "Anni balanciert ein Törtchen.",
  "Alle tanzen mit dem Dino.",
  "Jakob trägt eine Brille.",
  "Anni trägt eine Brille.",
  "Sarah spielt Flöte.",
  "Anni spielt Flöte.",
  "Eva isst eine Banane.",
  "Anni isst eine Banane.",
  "Malin baut ein Kaugummihaus.",
  "Anni baut ein Kaugummihaus.",
  "Mila trinkt warmen Kakao.",
  "Anni trinkt warmen Kakao.",
  "Jakob rutscht im Flur.",
  "Anni rutscht im Flur.",
  "Eva weckt die Wolke.",
  "Anni weckt die Wolke.",
  "Sarah läuft sehr schnell.",
  "Anni läuft sehr schnell.",
  "Mila tanzt mit dem Monster.",
  "Anni tanzt mit dem Monster.",
  "Jakob spricht mit dem Fuchs.",
  "Anni spricht mit dem Fuchs.",
  "Eva pflanzt bunte Blumen.",
  "Anni pflanzt bunte Blumen.",
  "Sarah schläft im Beutel.",
  "Anni schläft im Beutel.",
  "Malin fliegt auf der Erdbeere.",
  "Anni fliegt auf der Erdbeere.",
  "Ein Schmetterling fliegt.",
  "Der Hubschrauber landet.",
  "Wir lesen ein Buch.",
  "Die Feuerwehr hilft schnell.",
  "Der Pinguin rutscht auf Eis.",
  "Eine Biene sucht Honig.",
  "Wir bauen eine große Burg.",
  "Im Laden gibt es Erdbeeren.",
  "Der Uhu liest leise.",
  "Die Ameise trägt ein Blatt.",
  "Das Nilpferd schwimmt im See.",
  "Der Löwe schläft tief.",
  "Der Affe klaut die Brille.",
  "Die Schnecke kriecht langsam.",
  "Der Hund fängt den Ball.",
  "Die Katze schnurrt süß.",
  "Wir bauen eine Höhle.",
  "Der rote Ballon fliegt hoch.",
  "Am Strand bauen wir Burgen.",
  "Das Auto fährt schnell.",
  "Der Schmetterling landet.",
  "Im Wald wachsen Beeren.",
  "Wir backen leckeren Kuchen.",
  "Die Gans watschelt laut.",
  "Der Hamster rennt im Rad.",
  "Ein Frosch hüpft im Teich.",
  "Die Sonne scheint warm.",
  "Der Spatz sucht Krümel.",
  "Wir bauen einen Schneemann.",
  "Der Regenbogen leuchtet bunt.",
  "Eine Eidechse sitzt im Gras.",
  "Das Pony läuft über Wiesen.",
  "Ein Hase hoppelt schnell.",
  "Die Affen klettern hoch.",
  "Der Panda isst grünen Bambus.",
  "Der Wal singt im Meer.",
  "Wir malen ein schönes Bild.",
  "Ein Stern fällt vom Himmel.",
  "Die Suppe kocht im Topf.",
  "Die kluge Eule weiß viel.",
  "Eine Spinne webt ihr Netz.",
  "Wir sammeln bunte Blätter.",
  "Das Eichhörnchen sucht Nüsse.",
  "Wir schaukeln hoch hinaus.",
  "Ein Goldfisch schwimmt leise.",
  "Die Giraffe frisst Blätter.",
  "Ein Zebra hat Streifen.",
  "Der Pfau zeigt seine Federn.",
  "Eine Hummel brummt laut.",
  "Das große Schiff fährt weit.",
  "Im Garten blühen rote Rosen.",
  "Wir singen am Lagerfeuer.",
  "Der Delfin springt hoch.",
  "Das Känguru hüpft fröhlich.",
  "Die Kinder lachen laut.",
  "Der Adler fliegt hoch oben.",
  "Der Bäcker backt Brötchen.",
  "Wir machen ein tolles Picknick.",
  "Der Maulwurf gräbt ein Loch.",
  "Eine Raupe frisst ein Blatt.",
  "Ein Astronaut tanzt im All.",
  "Die Meerjungfrau sucht Perlen.",
  "Der Pirat sucht den Schatz.",
  "Der Drache speit kein Feuer.",
  "Die Prinzessin wohnt im Schloss.",
  "Der Ritter reitet sein Pferd.",
  "Der Zauberer macht einen Trick.",
  "Der Traktor bringt Heu.",
  "Der Tintenfisch malt bunt.",
  "Der Papagei spricht laut.",
  "Die Fee fliegt durchs Zimmer.",
  "Wir bauen ein Zelt.",
  "Der Hund sucht den Knochen.",
  "Das gelbe Boot taucht tief.",
  "Der Fuchs liest ein Buch.",
  "Die Hummel schläft in Blumen.",
  "Wir backen Kekse.",
  "Der Koala klettert langsam.",
  "Ein Komet fliegt schnell.",
  "Die Krabbe läuft im Sand.",
  "Der Biber baut einen Damm.",
  "Der Waschbär wäscht Äpfel.",
  "Wir suchen bunte Muscheln.",
  "Der König trägt eine Krone.",
  "Der Igel rollt sich ein.",
  "Der Luftballon schwebt hoch.",
  "Wir rutschen ins Wasser.",
  "Das Eichhörnchen hüpft.",
  "Der Delfin schwimmt schnell.",
  "Der Tiger schleicht leise."
];

export default function GermanGame({ 
  onBack, 
  onBonus, 
  learnedLetters, 
  fontStyle, 
  score, 
  onScoreChange, 
  onCorrectAnswer,
  adventureMathSolved,
  adventureGermanSolved
}: GermanGameProps) {
  const [sessionPoints, setSessionPoints] = useState(0);
  const [currentWord, setCurrentWord] = useState<GermanWord | null>(null);
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [taskType, setTaskType] = useState<GermanTaskType>('ARTICLE');
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLastCorrect, setIsLastCorrect] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [voiceAttempts, setVoiceAttempts] = useState<number>(0);
  const [heardText, setHeardText] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTrainingWord, setIsTrainingWord] = useState(false);
  const isRecordingRef = useRef(false);
  const taskPoolRef = useRef<GermanTaskType[]>([]);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'de-DE';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setHeardText(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage("Mikrofon nicht erlaubt. Bitte Zugriff geben!");
        }
        setIsRecording(false);
        isRecordingRef.current = false;
      };

      recognition.onend = () => {
        // If we are still logically in recording mode, restart recognition
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            console.error('Restart failed', e);
            setIsRecording(false);
            isRecordingRef.current = false;
          }
        } else {
          setIsRecording(false);
          isRecordingRef.current = false;
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setHeardText("");
      setErrorMessage(null);
      setIsRecording(true);
      isRecordingRef.current = true;
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(false);
      isRecordingRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
  };
  const fictiveTaskPoolRef = useRef<GermanTaskType[]>([]);
  const lastTaskTypeRef = useRef<GermanTaskType | null>(null);
  const tracingCasingRef = useRef<'UPPER' | 'LOWER'>(Math.random() > 0.5 ? 'UPPER' : 'LOWER');
  const [tracingChar, setTracingChar] = useState<string>("");
  const recentWordsRef = useRef<string[]>([]);
  const recentSentencesRef = useRef<string[]>([]);

  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const getNextTaskType = (fictive: boolean): GermanTaskType => {
    const poolRef = fictive ? fictiveTaskPoolRef : taskPoolRef;
    
    if (poolRef.current.length === 0) {
      const allPossibleTypes: GermanTaskType[] = fictive 
        ? ['VOICE_READING', 'TRACING'] 
        : ['ARTICLE', 'SYLLABLES', 'VOICE_READING', 'TRACING'];
      
      let newPool = shuffle(allPossibleTypes);
      
      // Ensure the first item of the new pool isn't the same as the last task
      if (newPool.length > 1 && newPool[0] === lastTaskTypeRef.current) {
        const swapIdx = newPool.findIndex(t => t !== lastTaskTypeRef.current);
        if (swapIdx !== -1) {
          [newPool[0], newPool[swapIdx]] = [newPool[swapIdx], newPool[0]];
        }
      }
      
      poolRef.current = newPool;
    }
    
    const nextType = poolRef.current.shift()!;
    lastTaskTypeRef.current = nextType;
    return nextType;
  };

  const getFilteredWords = useCallback(() => {
    const learnedSet = new Set(learnedLetters.map(l => l.toUpperCase()));
    return ALL_WORDS.filter(item => {
      for (let i = 0; i < item.word.length; i++) {
        const char = item.word[i].toUpperCase();
        // Special case for ß as toUpperCase can be different
        if (item.word[i] === 'ß') {
          if (!learnedSet.has('ß') && !learnedSet.has('ẞ')) return false;
          continue;
        }
        if (!learnedSet.has(char)) return false;
      }
      return true;
    });
  }, [learnedLetters]);

  const generateFictiveWord = useCallback(() => {
    if (learnedLetters.length === 0) return null;
    const length = Math.floor(Math.random() * 2) + 2; // 2-3 letters
    const chosenLetters = [...learnedLetters].map(l => l.toUpperCase());
    
    let word = "";
    for (let i = 0; i < length; i++) {
      word += chosenLetters[Math.floor(Math.random() * chosenLetters.length)];
    }
    
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }, [learnedLetters]);

  const generateQuestion = useCallback(() => {
    setIsProcessing(false);
    setErrorMessage(null);
    setVoiceAttempts(0);
    const filtered = getFilteredWords();
    let word: GermanWord | null = null;
    let fictive = false;

    if (filtered.length === 0) {
      const fake = generateFictiveWord();
      if (!fake) {
        setCurrentWord(null);
        setIsTrainingWord(false);
        return;
      }
      word = { word: fake, article: 'Das', syllables: fake.length > 2 ? 2 : 1 };
      fictive = true;
    } else {
      // Filter out recently used words to prevent repetition
      let availableWords = filtered.filter(w => !recentWordsRef.current.includes(w.word));
      if (availableWords.length === 0) {
        // If all filtered words are recently used, clear the oldest half to open up options
        recentWordsRef.current = recentWordsRef.current.slice(Math.floor(recentWordsRef.current.length / 2));
        availableWords = filtered.filter(w => !recentWordsRef.current.includes(w.word));
        if (availableWords.length === 0) {
          availableWords = filtered;
        }
      }
      word = availableWords[Math.floor(Math.random() * availableWords.length)];
      
      // Track recently used words (keep up to 15)
      recentWordsRef.current.push(word.word);
      if (recentWordsRef.current.length > 15) {
        recentWordsRef.current.shift();
      }
    }

    setIsTrainingWord(fictive);

    const type = getNextTaskType(fictive);
    setTaskType(type);

    if (type === 'TRACING') {
      const isUpper = tracingCasingRef.current === 'UPPER';
      const char = isUpper ? word.word.charAt(0).toUpperCase() : word.word.charAt(0).toLowerCase();
      setTracingChar(char);
      // Toggle for the next tracing task
      tracingCasingRef.current = isUpper ? 'LOWER' : 'UPPER';
    }

    if (type === 'VOICE_READING') {
      if (fictive) {
        setCurrentSentence(word.word);
        setCurrentWord(word);
      } else {
        // Filter out recently read sentences to keep reading highly varied
        let availableSentences = ALL_SENTENCES.filter(s => !recentSentencesRef.current.includes(s));
        if (availableSentences.length === 0) {
          recentSentencesRef.current = recentSentencesRef.current.slice(Math.floor(recentSentencesRef.current.length / 2));
          availableSentences = ALL_SENTENCES.filter(s => !recentSentencesRef.current.includes(s));
          if (availableSentences.length === 0) {
            availableSentences = ALL_SENTENCES;
          }
        }
        const sentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
        
        // Track recently read sentences (keep up to 15)
        recentSentencesRef.current.push(sentence);
        if (recentSentencesRef.current.length > 15) {
          recentSentencesRef.current.shift();
        }

        setCurrentSentence(sentence);
        setCurrentWord({ word: sentence, article: 'Der', syllables: 0 }); // Word field reused for sentence display
      }
    } else {
      setCurrentWord(word);

      if (type === 'ARTICLE') {
        setOptions(['Der', 'Die', 'Das']);
      } else if (type === 'SYLLABLES') {
        setOptions(['1', '2', '3', '4', '5']);
      }
    }

    setFeedback(null);
  }, [getFilteredWords, learnedLetters, generateFictiveWord]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = async (selected: string) => {
    if (isProcessing || !currentWord) return;
    setIsProcessing(true);

    let isCorrect = false;
    let context = "";

    if (taskType === 'ARTICLE') {
      if (currentWord.word === 'Schild') {
        isCorrect = selected === 'Der' || selected === 'Das';
        context = `Der Artikel für "Schild" kann "Der" oder "Das" sein. Das Kind hat "${selected}" gewählt.`;
      } else {
        isCorrect = selected === currentWord.article;
        context = `Der Artikel für "${currentWord.word}" ist "${currentWord.article}". Das Kind hat "${selected}" gewählt.`;
      }
    } else if (taskType === 'SYLLABLES') {
      isCorrect = parseInt(selected) === currentWord.syllables;
      context = `Das Wort "${currentWord.word}" hat ${currentWord.syllables} Silben. Das Kind hat "${selected}" gewählt.`;
    } else if (taskType === 'VOICE_READING') {
      // Accuracy check for reading
      const target = currentWord.word.toLowerCase().replace(/[.,!?;:]/g, "").trim();
      const heard = heardText.toLowerCase().replace(/[.,!?;:]/g, "").trim();
      
      // Simple fuzzy check: at least 70% of the words should be present
      const targetWords = target.split(/\s+/);
      const heardWords = heard.split(/\s+/);
      let matches = 0;
      targetWords.forEach(w => {
        if (heard.includes(w)) matches++;
      });
      
      const accuracy = matches / targetWords.length;
      isCorrect = accuracy >= 0.5;
      
      const nextAttempts = voiceAttempts + 1;
      setVoiceAttempts(nextAttempts);

      if (!isCorrect) {
        if (nextAttempts < 3) {
          setErrorMessage(`Versuche es noch einmal ganz langsam! 🐢 (Noch ${3 - nextAttempts} ${3 - nextAttempts === 1 ? 'Versuch' : 'Versuche'})`);
        } else {
          setErrorMessage("Schade! Alle 3 Versuche verbraucht. Wir gehen zur nächsten Aufgabe! 🐦");
        }
      }
      context = `Das Kind hat versucht zu lesen. Erkannt: "${heardText}". Ziel: "${currentWord.word}". Genauigkeit: ${Math.round(accuracy * 100)}%`;
      stopRecording();
    } else if (taskType === 'TRACING') {
      isCorrect = true;
      context = `Das Kind hat den Buchstaben erfolgreich nachgespurt.`;
    }
    
    setIsLastCorrect(isCorrect);
    setFeedback("show");
    
    // Success: brief celebration, then next question
    // Failure: show sad feedback, but allow quick retry
    const currentCheckAttempts = taskType === 'VOICE_READING' ? (voiceAttempts + 1) : 0;
    const isFinalVoiceFailure = taskType === 'VOICE_READING' && !isCorrect && currentCheckAttempts >= 3;

    const feedbackTime = isCorrect ? 2000 : (taskType === 'VOICE_READING' ? 3000 : 2000);
    const processingTime = isCorrect 
      ? 2000 
      : (taskType === 'VOICE_READING' 
          ? (isFinalVoiceFailure ? 3000 : 1000) 
          : 2000
        );

    if (isCorrect) {
      onScoreChange(1);
      const newSessionPoints = sessionPoints + 1;
      setSessionPoints(newSessionPoints);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#FFD93D', '#6BCB77']
      });

      if (!onCorrectAnswer && newSessionPoints % 5 === 0) {
        setTimeout(() => {
          setIsProcessing(false);
          if (onCorrectAnswer) {
            onCorrectAnswer();
          } else {
            generateQuestion();
          }
          onBonus();
          setFeedback(null);
        }, feedbackTime);
        return;
      }
    } else {
      // It is NOT correct
      if (taskType === 'VOICE_READING') {
        if (currentCheckAttempts >= 3) {
          onScoreChange(-1);
        }
      } else {
        onScoreChange(-1);
      }
    }

    setTimeout(() => {
      setIsProcessing(false);
      if (isCorrect) {
        setFeedback(null);
        if (onCorrectAnswer) {
          onCorrectAnswer();
        } else {
          generateQuestion();
        }
      } else if (taskType === 'VOICE_READING' && currentCheckAttempts >= 3) {
        // If voice reading has run out of attempts, we ALSO advance to the next question!
        setFeedback(null);
        if (onCorrectAnswer) {
          onCorrectAnswer();
        } else {
          generateQuestion();
        }
      }
    }, processingTime);

    // If it was wrong, clear the feedback after the full feedback time
    // unless they start a new try which clears it anyway
    if (!isCorrect) {
      setTimeout(() => {
        setFeedback(prev => (prev === "show" ? null : prev));
      }, feedbackTime);
    }
  };

  const getTaskContent = () => {
    if (!currentWord) return null;

    switch (taskType) {
      case 'ARTICLE':
        return {
          icon: <Search className="w-12 h-12 text-brand-red" />,
          title: "Der, Die oder Das?",
          display: currentWord.word,
          color: "text-brand-red",
          visual: (
            <div className="flex gap-2 justify-center mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center text-xs font-bold text-brand-blue">DER</div>
              <div className="w-8 h-8 rounded-lg bg-brand-red/20 flex items-center justify-center text-xs font-bold text-brand-red">DIE</div>
              <div className="w-8 h-8 rounded-lg bg-brand-green/20 flex items-center justify-center text-xs font-bold text-brand-green">DAS</div>
            </div>
          )
        };
      case 'SYLLABLES':
        return {
          icon: <AudioLines className="w-12 h-12 text-brand-blue" />,
          title: "Wie viele Silben hörst du?",
          display: currentWord?.word || "",
          color: "text-brand-blue",
          visual: (
            <div className="flex gap-4 justify-center mb-6 opacity-60">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="text-2xl">🐿️</div>
                  <div className="w-12 h-4 rounded-full border-b-4 border-brand-blue/20" />
                </div>
              ))}
            </div>
          )
        };
      case 'VOICE_READING':
        return {
          icon: <Volume2 className="w-12 h-12 text-brand-green" />,
          title: isTrainingWord ? "Aussprache-Training: Sprich es aus!" : "Lies laut vor!",
          display: currentWord.word,
          color: "text-brand-green",
          visual: (
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl"
              >
                {isTrainingWord ? "🫧" : "🗣️"}
              </motion.div>
            </div>
          )
        };
      case 'TRACING':
        return {
          icon: <Languages className="w-12 h-12 text-brand-blue" />,
          title: "Buchstaben nachspuren",
          display: tracingChar,
          color: "text-brand-blue",
          visual: (
            <div className="w-full max-w-2xl mx-auto">
              <GermanTracingCanvas 
                letter={tracingChar}
                fontStyle={fontStyle}
                color="#4D96FF"
                onComplete={() => handleAnswer("TRACED")}
              />
            </div>
          )
        };
    }
  };

  const content = getTaskContent();

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white kid-shadow kid-shadow-hover hover:bg-gray-50"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          {adventureMathSolved !== undefined && adventureGermanSolved !== undefined ? (
            <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full mr-1 sm:mr-2 border border-white/40 shadow-sm">
              <span className="text-[9px] uppercase tracking-wider text-[#8B4513]/70 font-black mr-0.5 leading-none">Aufgaben:</span>
              <div className="flex gap-1 items-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`math-${i}`}
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] sm:text-[9px] transition-all ${
                      i < adventureMathSolved 
                        ? 'bg-brand-blue text-white scale-110 font-black' 
                        : 'bg-gray-150 text-gray-400 border border-gray-200'
                    }`}
                  >
                    +
                  </motion.div>
                ))}
                <span className="text-gray-300 text-[10px] sm:mx-0.5 pointer-events-none">•</span>
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`german-${i}`}
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] sm:text-[9px] transition-all ${
                      i < adventureGermanSolved 
                        ? 'bg-brand-red text-white scale-110 font-black' 
                        : 'bg-gray-150 text-gray-400 border border-gray-200'
                    }`}
                  >
                    A
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="hidden xs:flex gap-1 items-center bg-white/50 px-3 py-1 rounded-full mr-2">
              {Array.from({ length: sessionPoints % 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 bg-brand-yellow rounded-full"
                />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 bg-brand-yellow px-3 sm:px-4 py-2 rounded-full font-display font-bold text-sm sm:text-base text-white border-2 border-white/50 kid-shadow">
            <Star className="w-4 h-4 sm:w-5 h-5 fill-current text-white" />
            <span>{score} Sterne</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-red text-white px-3 sm:px-4 py-2 rounded-full font-display font-bold text-sm sm:text-base">
            <GraduationCap className="w-4 h-4 sm:w-5 h-5" />
            <span>Profi</span>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] kid-shadow text-center relative overflow-hidden transition-all duration-500
          ${taskType === 'TRACING' ? 'p-2 md:p-4 min-h-[400px] md:min-h-[550px]' : 'p-4 md:p-8 min-h-[250px] md:min-h-[400px] flex flex-col justify-center'}
          border-b-8 border-brand-yellow/20
        `}
      >
        <div className={`absolute top-0 left-0 w-full h-4 ${taskType === 'ARTICLE' ? 'bg-brand-red' : taskType === 'SYLLABLES' ? 'bg-brand-blue' : 'bg-brand-green'} pointer-events-none`} />
        
        {taskType !== 'TRACING' && (
          <>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gray-50 rounded-full opacity-50 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gray-50 rounded-full opacity-50 pointer-events-none" />
          </>
        )}
        
        {currentWord ? (
          <>
            <div className={`flex flex-col items-center gap-2 ${taskType === 'TRACING' ? 'mb-2 mt-4 opacity-50 scale-90' : 'mb-6'}`}>
              {content?.icon}
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs sm:text-sm">{content?.title}</p>
            </div>

            {content?.visual}

            <h2 
              lang="de"
              className={`mb-6 md:mb-10 drop-shadow-sm break-words hyphens-auto ${content?.color} ${
                fontStyle === 'CURSIVE' ? 'font-school' : 'font-display'
              } ${
                taskType === 'TRACING' ? 'hidden' : // Hide huge text during tracing
                taskType === 'VOICE_READING' ? (
                  (content?.display && content.display.length > 80)
                    ? 'text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight px-2'
                    : (content?.display && content.display.length > 40)
                      ? 'text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight px-2'
                      : 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight px-2'
                ) : (
                  (content?.display && content.display.length > 80)
                    ? 'text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight px-2'
                    : (content?.display && content.display.length > 40)
                      ? 'text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight px-2'
                      : (content?.display && content.display.length > 20) 
                        ? 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight px-2' 
                        : (content?.display && content.display.length > 10)
                          ? 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl px-2'
                          : 'text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] px-2'
                )
              }`}
            >
              {content?.display}
            </h2>

            {taskType !== 'VOICE_READING' && taskType !== 'TRACING' ? (
              <div className={`grid gap-4 ${
                taskType === 'SYLLABLES' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' :
                taskType === 'ARTICLE' ? 'grid-cols-2 sm:grid-cols-3' :
                'grid-cols-2'
              }`}>
                {options.map((option) => {
                  const optionIsCorrect =
                    taskType === 'ARTICLE'
                      ? (currentWord.word === 'Schild' ? (option === 'Der' || option === 'Das') : option === currentWord.article)
                      : (taskType === 'SYLLABLES' ? parseInt(option) === currentWord.syllables : false);

                  return (
                    <button
                      key={option}
                      disabled={isProcessing}
                      onClick={() => handleAnswer(option)}
                      className={`py-6 rounded-2xl font-display text-2xl md:text-3xl kid-shadow kid-shadow-hover border-4 border-transparent transition-all
                        ${isProcessing && isLastCorrect && optionIsCorrect ? 'bg-brand-green text-white scale-105' : ''}
                        ${isProcessing && !isLastCorrect && optionIsCorrect ? 'bg-gray-50 opacity-100' : ''}
                        ${isProcessing && !optionIsCorrect ? 'opacity-30' : ''}
                        ${!isProcessing ? 'bg-gray-50 hover:bg-white active:bg-gray-100' : ''}
                      `}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : taskType === 'VOICE_READING' ? (
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-wrap justify-center gap-6 items-center">
                  {!isRecording ? (
                    <button
                      disabled={isProcessing}
                      onClick={startRecording}
                      className="h-24 px-10 rounded-full bg-brand-orange text-white flex items-center justify-center gap-4 transition-all kid-shadow hover:scale-105 active:scale-95"
                    >
                      <Mic className="w-10 h-10" />
                      <span className="text-white font-bold text-3xl font-display">Start</span>
                    </button>
                  ) : (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleAnswer("DONE")}
                      className="h-24 px-10 rounded-full bg-brand-red text-white flex items-center justify-center gap-4 transition-all kid-shadow animate-pulse"
                    >
                      <Square className="w-10 h-10 fill-current" />
                      <span className="text-white font-bold text-3xl font-display">Stop & Prüfen</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center gap-6 w-full">
                  <div className={`min-h-[100px] p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed w-full max-w-md flex flex-col items-center justify-center transition-all ${isRecording ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-200'}`}>
                    {isRecording ? (
                      <div className="flex flex-col items-center gap-4 w-full">
                        {/* Animated sound wave visualizer */}
                        <div className="flex items-center justify-center gap-1.5 h-10">
                          {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((_, idx) => (
                            <motion.div
                              key={idx}
                              className="w-1.5 bg-brand-orange rounded-full"
                              initial={{ height: 6 }}
                              animate={{ 
                                height: [6, 16 + Math.random() * 24, 6] 
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 0.5 + idx * 0.05,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>

                        <p className="text-brand-orange font-bold animate-pulse text-lg">
                          Ich höre dir zu... Sprich jetzt! 🐿️🎧
                        </p>

                        {heardText.trim().length > 0 && (
                          <div className="flex flex-col items-center gap-1 mt-1 bg-brand-orange/10 px-4 py-1.5 rounded-full border border-brand-orange/20">
                            <span className="text-[10px] text-brand-orange font-black uppercase tracking-wider">Stimme erfasst</span>
                            <div className="flex gap-1.5 items-center justify-center">
                              {Array.from({ length: Math.min(10, heardText.trim().split(/\s+/).length) }).map((_, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.1 }}
                                  className="w-2.5 h-2.5 bg-brand-orange rounded-full"
                                />
                              ))}
                              {heardText.trim().split(/\s+/).length > 10 && <span className="text-brand-orange font-black text-xs">...</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : heardText ? (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="flex items-center gap-2 text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full border border-brand-green/20">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-bold text-base sm:text-lg">Stimme erfolgreich erfasst!</span>
                        </div>
                        <p className="text-gray-500 text-sm text-center">
                          Drücke oben auf <span className="font-bold text-brand-red">"Stop & Prüfen"</span> für die Auswertung.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 w-full text-center">
                        <p className="text-gray-500 font-bold text-lg">
                          Bereit zum Vorlesen!
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm max-w-xs">
                          Klicke auf den orangefarbenen <span className="text-brand-orange font-bold">"Start"</span>-Knopf und lies den Satz laut vor.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 bg-brand-orange/15 px-4 py-2 rounded-xl text-brand-orange font-bold text-sm sm:text-base kid-shadow-sm">
                    <span>Versuch {Math.min(3, voiceAttempts + 1)} von 3</span>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="py-12 flex flex-col items-center">
            <div className="w-24 h-24 mb-6">
              <SquirrelMascot mood="SAD" className="w-full h-full" />
            </div>
            <h3 className="font-display text-3xl font-bold mb-4">Huch, SchlauEichi braucht Hilfe!</h3>
            <p className="text-gray-500 text-lg mb-8">
              Es gibt leider keine Wörter mit den gewählten Buchstaben.<br/>
              Geh bitte in die Einstellungen und wähle mehr Buchstaben aus!
            </p>
            <button
              onClick={() => onBack()}
              className="px-10 py-4 bg-brand-red text-white rounded-2xl font-display text-xl kid-shadow kid-shadow-hover"
            >
              Buchstaben auswählen
            </button>
          </div>
        )}

        <AnimatePresence>
          {feedback && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex flex-col items-center gap-4"
              >
                 {errorMessage && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-bold kid-shadow"
                   >
                     {errorMessage}
                   </motion.div>
                 )}
                 <motion.div 
                   initial={{ scale: 0, rotate: -20 }}
                   animate={{ scale: 1.4, rotate: 0 }}
                   className={`w-24 h-24 bg-white rounded-[32px] kid-shadow flex flex-col items-center justify-center border-4 ${isLastCorrect ? 'border-brand-green' : 'border-brand-red'}`}
                 >
                <motion.div 
                  animate={isLastCorrect ? 
                    { 
                      y: [0, -40, 0], 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.5, 1.2] 
                    } : 
                    { 
                      y: [0, 10, 0],
                      x: [-5, 5, -5, 5, 0], 
                      rotate: [0, 15, 0],
                      scale: 0.8
                    }
                  }
                  transition={isLastCorrect ? 
                    { repeat: Infinity, duration: 0.8 } : 
                    { duration: 0.5 }
                  }
                  className="w-20 h-20 flex items-center justify-center relative"
                >
                  {isLastCorrect ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg 
                        viewBox="0 0 24 24" 
                        className="w-16 h-16 text-brand-green filter drop-shadow-sm" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4.5" 
                        strokeLinecap="square" 
                        strokeLinejoin="miter"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl select-none filter drop-shadow-sm">
                      😢
                    </div>
                  )}
                  {!isLastCorrect && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    >
                      <span className="text-4xl">🌧️</span>
                    </motion.div>
                  )}
                  {isLastCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-10 -right-10 w-12 h-12"
                    >
                      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                        <path 
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                          fill="#FF4D4D" 
                          stroke="#CC0000" 
                          strokeWidth="1.5" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
