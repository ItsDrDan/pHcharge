# Proton Patrol (CHEM 3B pH & charge)

Study game for CHEM 3B acid–base chemistry: textbook Sections 4.10 (acidity of alcohols and phenols), 6.4 and 6.10 (carboxylic acids), 7.3 (amines as bases), 10.2 (acid–base properties of amino acids). Live at https://itsdrdan.github.io/phcharge/ once GitHub Pages is on.

- `index.html`: the whole game (standalone; no build step). Built on the Enzyme Engine game shell. Loads the brand kit, `games/track.js` (game id `phcharge`) and `textbook/js/fbx.js`, which draws every structure and runs Exam Practice from `textbook/bank/acids_esters.json` and `amines.json`.
- 5 main options → 11 topics: Acids & Bases (acid/base/neither, acid strength), Charge at Body pH (pH 7.4 and stomach, net charge of a molecule), Amino Acids & pI (charge at pH 7.4, above/below/at the pI, pick the drawn form, peptide charge), Salts & Solubility, Health & Clinic. Plus Skill Check Prep and Exam Practice.
- Charges are computed from the drawn structure: each –COOH is −1 at pH 7.4, each amine N +1, amide N 0. Amino acid questions follow the course rule: only physiological pH, pH = pI, or above/below the pI (no specific pH values). Histidine is left out on purpose (its side chain is close to neutral at 7.4). Amino acid and peptide questions show the structures (drawn with no charges for the student to ionize, then the correct charged form in the feedback), using the same drawing engine and side-chain style as Peptide Party (Exam #3 Reference Sheet). Acidic and basic amino acids use "strongly acidic/basic solution" for the fully protonated/deprotonated forms, since "below/above the pI" alone does not fix a single form for them.
- `ASSETS.md`: the art list (mascot Pip, logo, badges). Stand-ins show until the files exist.
- Links: `?topic=aa74,pi` opens topics directly; `?mode=exam` opens Exam Practice.

Game design and chemistry by ItsDrDan. Code written with AI assistance (Claude) and checked by the author. © ItsDrDan, all rights reserved; free to play, reuse by permission only (see LICENSE).
