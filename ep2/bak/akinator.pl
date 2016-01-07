:- dynamic yes/1,no/1.

go :- nl,
      write('Pense em uma personagem, e eu tentarei adivinhar quem é. Pensou (sim/não)?'),
      nl,
      read(Response),	
      nl,
      (Response == sim ; Response == s), 
      write('Ótimo! Agora, responda sim ou não às seguintes perguntas:'),
      nl, nl,
      guess(Personagem),
      write('A personagem é '),
      write(Personagem),
      nl,
      undo.

/* hipóteses a serem testadas */
guess(você)   :- você, !.
guess(homer_simpsom)   :- homer_simpsom, !.
guess(tweety) :- tweety, !.
guess(walter_white)   :- walter_white, !.
guess(desconhecido).             

/* regras */
pessoa:- tem_gênero.

animal:- verify(é_um_animal),!.
animal:- not(pessoa).

cartoon:- ( animal ; pessoa),
    verify(é_um_desenho),
    verify(é_famoso). 

homer_simpsom :- pessoa, 
		cartoon,         
        verify(é_amarelo),
    	verify(participa_numa_serie_TV),!.

você :- pessoa,    
    verify(pertence_a_tua_familia),
    verify(conhece_desde_sempre_tua_familia),!.

tweety :- animal, cartoon, 
    	verify(é_amarelo),
    	verify(participa_na_serie_Looney_Tunes),!.

walter_white :- pessoa, 
    	verify(é_do_gênero_masculino),
        verify(é_do_mal),
        verify(é_ator_drama),
    	verify(participa_na_serie_Breaking_Bad),!.

tem_gênero:- verify(é_do_gênero_masculino); verify(é_do_gênero_feminino),!.    
no(é_do_gênero_feminino):- yes(é_do_gênero_masculino).
yes(é_do_gênero_feminino):- no(é_do_gênero_masculino).


/* Selecionador de perguntas */
ask(Question) :-
    write('O personagem  '),
    write(Question),
    write('? '),
    read(Response),
    nl,
    ( (Response == sim ; Response == s)
      ->
      assert(yes(Question)) ;
       assert(no(Question)), fail).


/* Verificador de respostas */
verify(S) :- 
    (yes(S) -> true ; (no(S) -> fail ; ask(S))).

/* desfaz asserções */
undo :- retract(yes(_)),fail. 
undo :- retract(no(_)),fail.
undo.

