class AlimentsController < ApplicationController

  def index
    @aliments = if (params[:aliment].present? && params[:aliment][:search].present?)
      Aliment.search(params[:aliment][:search], operator: 'or', page: params[:page], per_page: 20, fields: [
        { name: :word_start },
        { food_group: :word_start }
      ])
    else
      Aliment.search('*', page: params[:page], per_page: 20)
    end
  end

  def show
    @aliment = Aliment.find params[:id]
  end

end
