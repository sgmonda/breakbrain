% -*- coding: utf-8 -*-

% arco-pfc.cls
%
% Copyright © 2011,2012 David Villa Alises
%
% This program is free software; you can redistribute it and/or modify
% it under the terms of the GNU General Public License as published by
% the Free Software Foundation; either version 2 of the License, or
% (at your option) any later version.
%
% This program is distributed in the hope that it will be useful,
% but WITHOUT ANY WARRANTY; without even the implied warranty of
% MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
% GNU General Public License for more details.
%
% You should have received a copy of the GNU General Public License
% along with this program; if not, write to the Free Software
% Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{arco-pfc}[2011/05/16 Arco modified book class]
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{book}}
\PassOptionsToClass{a4paper, 12pt, oneside, openright}{book}
\ProcessOptions\relax
\LoadClass{book}

\makeatletter

\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage[spanish]{babel}
\deactivatetilden  % FAQ-CervanTeX-6.html#ss6.7

%% -- Fundiciones
\renewcommand{\rmdefault}{ptm}   % times
\renewcommand{\sfdefault}{lmss}  % lmoderm sans sherif
\renewcommand{\ttdefault}{lmtt}  % lmoderm typewriter

\usepackage[htt]{hyphenat}
\usepackage{atbeginend}
\usepackage{xifthen}

\usepackage{enumitem}
\setlist{topsep=0pt, itemsep=0pt}
\newlist{definitionlist}{description}{1}
\setlist[definitionlist]{
  style     = nextline,
}


% Las normas tipográficas que aparecen en los comentarios corresponden al libro:
% J. Martínez de Sousa. Ortografía y ortotipografía del español actual. Trea, 2008.

%% -- MEDIDAS Y DISTANCIAS -----------------------------------------------------
\usepackage[left=35mm, right=20mm, top=25mm, bottom=25mm]{geometry}
\usepackage{setspace}
\setlength{\parskip}{2mm plus 0.2mm minus 0.2mm}

%% Párrafos
% La indentación que precede al párrafo normal debe ser de un
% cuadratín (1em) (-> 13.4.1.1)
\parindent   = 1em

% El espacio en blanco al final de una línea corta debe ser mayor que
% la indentación del párrafo. (-> 13.4.1.1)
\parfillskip = 1.5em plus 1fil


%% -- GRÁFICOS -----------------------------------------------------------------
\usepackage{graphicx}
\usepackage{epsfig}
\graphicspath{{figures/}{/usr/share/arco/figures/}}

%% -- COLORES ------------------------------------------------------------------
\usepackage[table]{xcolor}
\definecolor{white}{gray}{1}
\definecolor{gray97}{gray}{0.97}
\definecolor{gray95}{gray}{0.95}
\definecolor{gray75}{gray}{0.75}
\definecolor{gray45}{gray}{0.45}
\colorlet{tabheadbg}{gray!25}
\colorlet{tabrowbg} {gray!12.5}

%% -- EPÍGRAFES ----------------------------------------------------------------
% \usepackage[font=footnotesize,
%             labelfont=sc,
%             format=hang, indention=-5mm,
%             width=.9\textwidth]{caption}

%% --  CUADROS -----------------------------------------------------------------
\usepackage{booktabs}
\usepackage{colortbl} % coloreado de cuadros

\newcommand{\tabheadformat}{\rowcolor{tabheadbg} \parbox[c][.4cm]{0pt}{}}
\newcommand{\tabfootformat}{\tabheadformat}
\newcommand{\tabhead}[1]{{\textscale{.8}{\textbf{#1}}}}
\newcommand{\tabfoot}[1]{#1}
\newcommand{\tabcolorrow}{\rowcolor{tabrowbg}}

% cebreado para cuadros
\newcommand{\myrowcolors}[1]{\rowcolors{#1}{tabrowbg}{}}
\AfterEnd{tabular}{\rowcolors{1}{}{}}
\BeforeEnd{document}{\attributionArcoPFC}

%% colores
\usepackage{colortbl}
\usepackage{color}
\definecolor{gris}{rgb}{0.3,0.3,0.3}
\definecolor{grisclaro}{rgb}{0.85,0.85,0.85}
\definecolor{grisoscuro}{rgb}{0.2,0.2,0.2}
\definecolor{comentarios}{rgb}{0.15, 0.15, 0.4}
\definecolor{grisconsola}{rgb}{0.85,0.85,0.85}


%% -- LISTADOS DE CÓDIGO -------------------------------------------------------
\usepackage{listings}
\renewcommand{\lstlistlistingname}{Índice de listados}
\renewcommand{\lstlistingname}{Listado}

% de tocbibind, para que el índice de listados aparezca en la ToC
\renewcommand{\lstlistoflistings}{%
  \begingroup
  \tocfile{\lstlistlistingname}{lol}
  \endgroup}

\newcommand{\lstfont}{\ttfamily\fontfamily{pcr}}



\definecolor{lightgray}{rgb}{.9,.9,.9}
\definecolor{darkgray}{rgb}{.4,.4,.4}
\definecolor{purple}{rgb}{0.65, 0.12, 0.82}

% \lstset{tabsize=4,
%         showspaces=false,
%         showtabs=false,
%         frame=b,
%         framerule=1pt,
%         aboveskip=0.5cm,
%         framextopmargin=3pt,
%         framexbottommargin=3pt,
%         framexleftmargin=18pt,
%         framesep=.4pt,
%         rulesep=.4pt,
%         rulesepcolor=\color{grisoscuro},
%         stringstyle=\ttfamily,
%         showstringspaces = false,
%         basicstyle=\footnotesize\ttfamily,
%         commentstyle=\color{gris},
%         keywordstyle=\bfseries,
%         numbers=left,
%         numbersep=6pt,
%         numberstyle=\color[cmyk]{0.43, 0.35, 0.35,0.01}\bfseries\scriptsize\ttfamily,
%         numberfirstline = true,        
%         breaklines=true,
%         stepnumber=1,
%         backgroundcolor=\color{white},
%         xleftmargin=18pt,
%         framexrightmargin=0pt,
%         xrightmargin=0pt
% }

\lstdefinelanguage{JavaScript}{
  keywords={typeof, new, true, false, catch, function, return, null, catch, switch, var, if, in, while, do, else, case, break, console},
  keywordstyle=\color{black}\bfseries,
  ndkeywords={class, export, boolean, throw, implements, import, this},
  ndkeywordstyle=\color{darkgray}\bfseries,
  identifierstyle=\color{black},
  sensitive=false,
  comment=[l]{//},
  morecomment=[s]{/*}{*/},
  commentstyle=\color{gray}\ttfamily,
  stringstyle=\color{black}\ttfamily,
  morestring=[b]',
  morestring=[b]"
}


\lstset{%
     aboveskip          = 2mm,
     belowskip          = 2mm,
     %
     frame              = Ltb,
     framerule          = 0pt,
     framextopmargin    = 3pt,
     framexbottommargin = 3pt,
     framexleftmargin   = .4cm,
     framesep           = 0pt,
     rulesep            = .4pt,
     captionpos         = b,
     floatplacement     = htbp,
     %
     basicstyle         = \footnotesize\lstfont,
     showstringspaces   = false,
     commentstyle       = \color{gray45},
     keywordstyle       = \bfseries,
     %
     numbers            = none,
     stepnumber         = 1,
     numbersep          = 15pt,
     numberstyle        = \scriptsize,
     numberblanklines   = true,
     %
     breaklines         = true,
   }

\lstnewenvironment{listing}[1][]
   {\pagebreak[3]\singlespacing\lstset{#1}}%
   {\pagebreak[3]}


%% -- ACRÓNIMOS Y GLOSARIO -----------------------------------------------------
\usepackage[printonlyused]{acronym}

\renewcommand*{\acsfont}[1]{\textsc{\textscale{.85}{#1}}} % enunciado del acrónimo: OO
\renewcommand*{\acfsfont}[1]{#1}
\renewcommand*{\acffont}[1]{#1}

% imprime: "Object Oriented (OO)"
\newcommand{\acx}[1]{\acused{#1}\acs{#1} %
  \nolinebreak[3] %
  (\acl{#1})}

\newcommand{\Acro}[2]{\acro{#1}{#2}\acused{#1}}
\newcommand{\sigla}[1]{\textsc{\textscale{.85}{#1}}}


%% -- HIPER-ENLACES PARA PDF ---------------------------------------------------
\usepackage[bookmarks,
            hyperfootnotes = false,
            % backref,                % debug: refs desde la bibliografía
            pdfview        = {fitv},
            colorlinks     = true,
            urlcolor       = black,
            linkcolor      = black,
            citecolor      = black,
            pagecolor      = black,
            anchorcolor    = black
            ]{hyperref}

\hypersetup{
  pdftitle   = {\@title},
  pdfauthor  = {\@author},
  pdfsubject = {Proyecto Fin de Carrera},
}

% -- urls
% https://www.joachim-breitner.de/blog/archives/519-guid.html
\let\UrlSpecialsOld\UrlSpecials
\def\UrlSpecials{\UrlSpecialsOld\do\/{\Url@slash}\do\_{\Url@underscore}}%
\def\Url@slash{\@ifnextchar/{\kern-.11em\mathchar47\kern-.2em}%
    {\kern-.0em\mathchar47\kern-.08em\penalty\UrlBigBreakPenalty}}
\def\Url@underscore{\nfss@text{\leavevmode \kern.06em\vbox{\hrule\@width.3em}}}
\let\urlOld\url


%% -- BIBLIOGRAFÍA -------------------------------------------------------------
\renewcommand{\bibname}{Referencias}
\bibliographystyle{es-alpha}

\newcommand{\bibfont}{\small}      % Bibliography's font size
%% \setlength{\bibhang}{4ex}       % Indent of Bibliography entries
%% \setlength{\bibsep}{3pt}

% añadir listados, bibliografia, etc a la tabla de contenido
\usepackage{tocbibind}


%% -- FORMATO DE CAPÍTULOS Y SECCIONES -----------------------------------------
\usepackage[rigidchapters, clearempty]{titlesec}
% - rigidchapters: Todos los títulos de capítulo tienen la misma altura
% - clearempty: Elimina encabezados y pies de páginas (izquierdas) vacías.

\newcommand{\chapterformat}[1]{%
  \fontsize{22}{22}\selectfont\sffamily #1%
}

% doc: \titleformat{ command }[ shape ]{ format }{ label }{ sep }{ before }[ after ]

\newcommand{\frontchapterformat}{
  \titleformat{\chapter}[display]%
    {}
    {}
    {0mm}
    {\chapterformat}

  \titlespacing{\chapter}{0cm}{2cm}{2cm}
}

\let\frontmatterorig\frontmatter
\renewcommand{\frontmatter}{
  \frontmatterorig
  \singlespacing
  \pagestyle{fancy}
  \frontchapterformat
  \renewcommand{\chaptermark}[1]{\markboth{\uppercase{##1}}{}}
}

\newcommand{\mainchapterformat}{
  \titleformat{\chapter}[display]
    {\normalfont\large\sffamily}
    {\chaptertitlename\ \thechapter}
    {0mm}
    {\chapterformat}

  \titlespacing{\chapter}{0cm}{1cm}{3.8cm}
}

\let\mainmatterorig\mainmatter
\renewcommand{\mainmatter}{
  \cleardoublepage
  \mainmatterorig
  \mainchapterformat
  \pagestyle{fancy}
  \renewcommand{\chaptermark}[1]{\markboth{\thechapter.\ \textsc{##1}}{}}
  \onehalfspacing
  \cleardoublepage
}

\newcommand{\backchapterformat}{
  \frontchapterformat
}

\let\backmatterorig\backmatter
\renewcommand{\backmatter}{
  \backmatterorig
  \backchapterformat
  \cleardoublepage
}

% espaciado entre secciones, subseciones, etc.
% doc: \titlespacing*{ command }{ left }{ beforesep }{ aftersep }[ right ]
\titlespacing{\section}{0pt}{5mm}{0mm}
\titlespacing{\subsection}{0pt}{4mm}{-1mm}
\titlespacing{\subsubsection}{0pt}{4mm}{-1mm}


%% -- ESTILO DE PÁGINA, ENCABEZADOS Y PIES -------------------------------------
\usepackage{fancyhdr}
\pagestyle{fancy}

% para las páginas de título
\fancypagestyle{plain}{%
  \fancyhf{}%
  \renewcommand{\headrulewidth}{0pt}
  \fancyfoot[C]{\thepage}
}

\fancyhf{}
\headheight=13pt
\fancyhead[EL,OR]{\thepage}
\fancyhead[ER,OL]{\leftmark}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\chaptermark}[1]{%
  \markboth{\thechapter.\ \textsc{#1}}{}%
}

\newlength{\myoffset}
\myoffset=16pt
\fancyhfoffset[EL,OR]{\myoffset}

\addtolength{\footskip}{8pt}


%% -- Otros paquetes
\usepackage{relsize}  % tamaños relativos para el texto


%% -- VARIABLES DEL PAQUETE ----------------------------------------------------
\newcommand{\@authortitle}{}
\renewcommand{\author}[2]{%
  \renewcommand{\@author}{#1}
  \renewcommand{\@authortitle}{#2}}

\newcommand{\@advisor}{}
\newcommand{\@advisortitle}{}
\newcommand{\advisor}[2]{%
  \renewcommand{\@advisor}{#1}
  \renewcommand{\@advisortitle}{#2}}

\newcommand{\@address}{}
\newcommand{\address}[1]{\renewcommand{\@address}{#1}}
\newcommand{\@city}{Ciudad Real}
\newcommand{\city}[1]{\renewcommand{\@city}{#1}}
\newcommand{\@country}{Spain}
\newcommand{\country}[1]{\renewcommand{\@country}{#1}}
\newcommand{\phone}[1]{\newcommand{\@phone}{#1}}
\newcommand{\email}[1]{\newcommand{\@email}{#1}}
\newcommand{\@homepage}{}
\newcommand{\homepage}[1]{\renewcommand{\@homepage}{#1}}

\newcommand{\@logo}{images/emblema_informatica-gray.pdf}
\newcommand{\logo}[1]{\renewcommand{\@logo}{#1}}
\newcommand{\putlogo}{%
  \ifthenelse{\NOT \isundefined{\@logo}}{
    \includegraphics[width=35mm]{\@logo}\\
  }{
    \vspace*{2cm}
    NO SE HA DEFINIDO UN LOGO\\
    Utiliza  \texttt{$\backslash$logo}\\
    \vspace{2cm}
  }
}

\newcommand{\@publishmonth}{}
\newcommand{\@publishyear}{\year}
\newcommand{\publishdate}[2]{%
  \renewcommand{\@publishyear}{#1}
  \renewcommand{\@publishmonth}{#2}}

\newcommand{\@license}{%
  \begin{minipage}{1.1\textwidth}
    \begin{singlespace}
      Permission is granted to copy, distribute and/or modify this
      document under the terms of the GNU Free Documentation License,
      Version 1.3 or any later version published by the Free Software
      Foundation; with no Invariant Sections, no Front-Cover Texts,
      and no Back-Cover Texts.

      \smallskip
      Se permite la copia, distribución y/o modificación de este
      documento bajo los términos de la Licencia de Documentación
      Libre GNU, versión 1.3 o cualquier versión posterior publicada
      por la \emph{Free Software Foundation}; sin secciones
      invariantes.

    \smallskip
    Muchos de los nombres usados por las compañías para diferenciar
    sus productos y servicios son reclamados como marcas
    registradas. Allí donde estos nombres aparezcan en este documento,
    y cuando el autor haya sido informado de esas marcas registradas,
    los nombres estarán escritos en mayúsculas o como nombres propios.
  \end{singlespace}
  \end{minipage}
}
\newcommand{\license}[1]{\renewcommand{\@license}{#1}}



%% -- PÁGINAS ESPECIALES

% - portadilla
% Sólo aparece el título de la obra a la misma altura,
% fuente y estilo que en la portada pero en un tamaño 2/3 el de
% ésta. Opcionalmente puede aparecer el autor.
\newcommand{\pretitle}{%
  \thispagestyle{empty}
  \begin{center}%
    \vspace*{\stretch{3.2}}%
    {\large \textsc{\@title}}
     \par
    \vspace*{\stretch{6.8}}%
  \end{center}%
  \cleardoublepage
}


\newcommand{\frontpage}{%
  \pagestyle{empty}
  \begin{center}
    \putlogo
    \vspace{25mm}
    {\Large \textbf{UNIVERSIDAD DE CASTILLA-LA MANCHA}} \\
    \bigskip
    {\Large \textbf{ESCUELA SUPERIOR DE INFORMÁTICA}} \\
    \vspace{25mm}
    {\Large \textbf{INGENIERÍA}} \\
    \bigskip
    {\Large \textbf{EN INFORMÁTICA}} \\
    \vspace{30mm}
    {\Large \textbf{PROYECTO FIN DE CARRERA}} \\
    \vspace{14mm}

    \begin{doublespace}
      {\Large \@title}
    \end{doublespace}

    \vspace{12mm}
    {\large \@author}\\
    \vfill
    \hfill
    {\large \textbf{\@publishmonth, \@publishyear}}
  \end{center}

  \cleardoublepage

  \begin{center}
    \putlogo
    \vspace{15mm}
    {\Large \textbf{UNIVERSIDAD DE CASTILLA-LA MANCHA}} \\
    \bigskip
    {\Large \textbf{ESCUELA SUPERIOR DE INFORMÁTICA}}\\
    \bigskip
    {\Large Departamento de Tecnologías y Sistemas de Información}\\
    \vspace{45mm}
    {\Large \textbf{PROYECTO FIN DE CARRERA}} \\
    \bigskip

    \begin{doublespace}
      {\Large \@title}\\
    \end{doublespace}
  \end{center}

  \vspace{25mm}

  \begin{onehalfspace}
  \begin{flushleft}
    {\large Autor:\hspace{5mm} \@authortitle\,\@author}\\
    {\large Director: \@advisortitle\,\@advisor}\\
  \end{flushleft}
  \end{onehalfspace}

  \vfill
  \hfill
  {\large \textbf{\@publishmonth, \@publishyear}}
  \cleardoublepage
}

\newcommand{\dedication}[1]{%
  \cleardoublepage
  \null\vspace{\stretch{1}}
  \begin{flushright}
    \textit{#1}
  \end{flushright}
  \vspace{\stretch{2}}\null
  \cleardoublepage
}


\newcommand{\copyrightpage}{%
  \newpage
  \begin{singlespace}
    \null \vfill \noindent
    \textbf{\@author} \par
    \smallskip \noindent
    \@city\ -- \@country

    \vspace{-1cm}
    \begin{tabbing}
      \hspace*{1.7cm} \= \\
      \ifthenelse{\NOT \isundefined{\@email}}   {\emph{E-mail:}   \> \@email \\}{}
      \ifthenelse{\NOT \isundefined{\@phone}}   {\emph{Teléfono:} \> \@phone \\}{}
      \ifthenelse{\NOT \isundefined{\@homepage}}{\emph{Web site:} \> \url{\@homepage} \\}{}
    \end{tabbing}
    \vspace{-1cm}
    \noindent
    \copyright\ \number\@publishyear\ \ \@author \par
    \smallskip \noindent
    \begin{minipage}{0.8\textwidth} \raggedright \footnotesize
      \@license
    \end{minipage}
  \end{singlespace}
  \cleardoublepage
}


\newcommand{\jury}{%
  \vspace*{2cm}
  \noindent\underline{\textbf{{\Large TRIBUNAL:}}}
  \vspace{1.3cm}
  \par
  \textbf{{\large Presidente:}} \\ \par
  \textbf{{\large Vocal 1:}} \\ \par
  \textbf{{\large Vocal 2:}} \\ \par
  \textbf{{\large Secretario:}} \\ \par
  \vspace{2.5cm}
  \noindent\underline{\textbf{{\Large FECHA DE DEFENSA:}}} \par
  \vspace{2.2cm}
  \noindent\underline{\textbf{{\Large CALIFICACIÓN:}}} \par
  \vspace{3.6cm}
  \textbf{PRESIDENTE \hfil VOCAL 1 \hfil VOCAL 2 \hfil SECRETARIO} \par
  \vspace{3.1cm}
  Fdo.: \hfil Fdo.: \hfil Fdo.: \hfil Fdo.: \par
}

\addto\captionsspanish{\renewcommand{\appendixname}{Anexo}}

\newcommand{\appendixtitle} {
  \cleardoublepage
  \thispagestyle{empty}%
  \vspace*{5cm}%
  \begin{center}%
    \sffamily\scshape\Large\scalebox{3}{ANEXOS}%
  \end{center}%
}%


\newcommand{\attributionArcoPFC} {
  \cleardoublepage
  \pagestyle{empty}
  \null\vfill
  \rule{0pt}{8cm}
  \begin{singlespacing}
  \begin{center}
    Este documento fue editado y tipografiado con \LaTeX{}\\
    empleando la clase \textbf{arco-pfc} que se puede encontrar en:\\
    \url{https://bitbucket.org/arco_group/arco-pfc}

  \end{center}
  \end{singlespacing}
  \cleardoublepage
}


%% -- símbolos
\usepackage{pifont}
\usepackage{tipa}


%% -- letras capitales
\usepackage{lettrine}
\newcommand{\drop}[2]{%
  \lettrine[lines=2,findent=2pt,nindent=3pt,loversize=0.1]% lhang=0.33
  {\textcolor[gray]{0.4}{#1}}{#2}%
  }


\AtBeginDocument{
  % separación entre filas en los cuadros
  \setlength{\extrarowheight}{1pt}
}


%% -- Algunos comandos útiles
\newcommand{\quoteauthor}[1]{\par\hfill#1\hspace{1em}\mbox{}}


%\makeatother
