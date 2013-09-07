NAME=main
ARGS=-interaction nonstopmode --shell-escape

all: 
	pdflatex $(ARGS) $(NAME).tex && bibtex $(NAME) && makeindex $(NAME).idx && pdflatex $(ARGS) $(NAME).tex && pdflatex $(ARGS) $(NAME).tex

min:
	pdflatex $(ARGS) $(NAME).tex

clean:
	rm -rf *.out *.toc *.dvi *~ *.log *.aux  *.bbl *.blg ./dot/* ./cfg/*.log ./doc/*.aux ./doc/*.log ./doc/*.pdf ./doc/*.out ./doc/*.dvi *.idx *.ilg *.ind *.lof *.lot
