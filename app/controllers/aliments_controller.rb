class AlimentsController < ApplicationController
  autocomplete :aliment, :name

  before_action :set_page, only: :index

  def index
    if params['aliment'].present? && params['aliment']['name'].present?
      # @aliment = Aliment.where("name like ?", "%#{params['aliment']['name']}%").first
      @aliments = Aliment.where('name like ?', "%#{params['aliment']['name']}%").paginate(page: @page)
    else
      @aliments = if params[:aliment].present? && !params[:aliment][:name].blank?
                    Aliment.search(
                      params[:aliment][:name],
                      page: params[:page],
                      per_page: 20,
                      operator: 'or',
                      fields: [
                        { name: :word_start },
                        { food_group: :word_start }
                      ]
                    ).paginate(page: @page)
                  else
                    Aliment.search('*', page: params[:page], per_page: 20)
                  end

      @aliment = nil
    end
  end

  def show
    @aliment = Aliment.find params[:id]
  end

  private

  def aliment_params
    params.require(:aliment).permit(:name, :food_group)
  end
end
