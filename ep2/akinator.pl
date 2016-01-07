/* Renato Lui Geh */
/* NUSP: 8536030  */

:- dynamic yes/1,no/1.
/*:- dynamic guess/1.*/

go :- nl,
      write('Think of a Breaking Bad or Game of Thrones character and I\'ll try to guess who! Ready? (yes/no)'),
      nl,
      read(Response),
      nl,
      (Response == yes ; Response == y),
      write('Great! Now answer the following yes/no questions:'),
      nl, nl,
      guess(Personagem),
      write('The character is '),
      write(Personagem),
      nl,
      undo.

/* Hipóteses a serem testadas. */

/*foreach(member(X, [tyrion_lannister, tywin_lannister, jamie_lannister, cersei_lannister, arya_stark,
  jon_snow, sansa_stark, jorah_mormont, bran_stark, hodor, walter_white, skyler_white, jesse_pinkman,
  hank_schrader, saul_goodman, mike_ehrmantraut, gus_fring, badger]), assert((guess(X) :- X,!.))).*/

guess(tyrion_lannister) :- tyrion_lannister,!.
guess(tywin_lannister) :- tywin_lannister,!.
guess(jamie_lannister) :- jamie_lannister,!.
guess(cersei_lannister) :- cersei_lannister,!.
guess(arya_stark) :- arya_stark,!.
guess(jon_snow) :- jon_snow,!.
guess(sansa_stark) :- sansa_stark,!.
guess(jorah_mormont) :- jorah_mormont,!.
guess(bran_stark) :- bran_stark,!.
guess(hodor) :- hodor,!.

guess(walter_white) :- walter_white,!.
guess(skyler_white) :- skyler_white,!.
guess(jesse_pinkman) :- jesse_pinkman,!.
guess(hank_schrader) :- hank_schrader,!.
guess(flynn_white) :- flynn_white,!.
guess(marie_schrader) :- marie_schrader,!.
guess(saul_goodman) :- saul_goodman,!.
guess(mike_ehrmantraut) :- mike_ehrmantraut,!.
guess(gus_fring) :- gus_fring,!.
guess(badger) :- badger,!.

guess(unknown).

/* Regras. */

/* Gender. */
no(is_female) :- yes(is_male).
yes(is_female) :- no(is_male).

/* Fantasy character. */
fantasy :- verify(is_from_fantasy).

/* Game of Thrones */

tyrion_lannister :- fantasy,
  verify(is_male),
  verify(is_lannister),
  verify(is_dwarf),!.

tywin_lannister :- fantasy,
  verify(is_male),
  verify(has_children),
  verify(is_lannister),
  verify(is_kings_hand),!.

jamie_lannister :- fantasy,
  verify(is_male),
  verify(has_children),
  verify(is_lannister),
  verify(is_kingslayer),!.

jon_snow :- fantasy,
  verify(is_male),
  verify(is_bastard),
  verify(knows_nothing),!.

jorah_mormont :- fantasy,
  verify(is_male),
  verify(is_in_love),!.

bran_stark :- fantasy,
  verify(is_male),
  verify(is_stark),
  verify(is_child),
  verify(is_wight),!.

hodor :- fantasy,
  verify(is_male),
  verify(hodor_hodor),!.

cersei_lannister :- fantasy,
  verify(is_female),
  verify(has_children),
  verify(is_lannister),
  verify(is_queen_regent),!.

arya_stark :- fantasy,
  verify(is_female),
  verify(is_stark),
  verify(is_child),
  verify(has_many_faces),!.

sansa_stark :- fantasy,
  verify(is_female),
  verify(is_stark),
  verify(is_teenager),!.

/* Breaking Bad */

walter_white :-
  verify(is_male),
  verify(has_children),
  verify(is_married),
  verify(has_cancer),!.

skyler_white :-
  verify(is_female),
  verify(has_children),
  verify(is_married),
  verify(has_car_washer),!.

jesse_pinkman :-
  verify(is_male),
  verify(is_teenager),
  verify(loves_chemistry),!.

hank_schrader :-
  verify(is_male),
  verify(is_bold),
  verify(is_married),
  verify(is_cop),!.

marie_schrader :-
  verify(is_female),
  verify(is_married),
  verify(hates_minerals),!.

saul_goodman :-
  verify(is_male),
  verify(is_lawyer),!.

mike_ehrmantraut :-
  verify(is_male),
  verify(is_bold),
  verify(was_cop),
  verify(has_granddaughter),!.

gus_fring :-
  verify(is_male),
  verify(is_owner_of_pollos_hermanos),!.

flynn_white :-
  verify(is_male),
  verify(is_teenager),
  verify(has_daddy_issues),!.

badger :-
  verify(is_male),
  verify(is_teenager),
  verify(has_animal_name),
  verify(is_stupid),!.

/* Selecionador de perguntas */
ask(Question) :-
    write('Is it true that the character '),
    write(Question),
    write('? '),
    read(Response),
    nl,
    ( (Response == yes ; Response == y)
      ->
      assert(yes(Question)) ;
       assert(no(Question)), fail).


/* Verificador de respostas. */
verify(S) :-
    (yes(S) -> true ; (no(S) -> fail ; ask(S))).

/* Desfaz asserções. */
undo :- retract(yes(_)),fail.
undo :- retract(no(_)),fail.
undo.

