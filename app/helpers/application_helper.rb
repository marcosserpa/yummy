module ApplicationHelper
  DAILY_PECENTAGES = {
    water: 2.7, # l
    energy: 2000, # 1600 cal
    energy_from_carbs: 2000, # 1600 cal
    energy_from_proteins: 2000, # 1600 cal
    energy_from_fats: 2000, # 1600 cal
    protein: 50, # g
    fat: 65, # g
    carbohydrate: 300, # g
    fiber: 25, # g
    glucose: 211,
    calcium: 1000, # mg
    iron: 18, # mg
    magnesium: 400, # mg
    phosphorus: 1000, # mg
    potassium: 3500, # mg
    sodium: 2400, # mg
    zinc: 15, # mg
    copper: 2, # mg
    manganese: 2, # mg
    selenium: 70, # µg
    vitamin_c: 60, # mg
    thiamin: 1.5, # mg
    riboflavin: 1.7, # mg
    niacin: 20, # mg
    pantothenic_acid: 10, # mg
    vitamin_b6: 2, # mg
    folate_total: 400, # µg
    vitamin_b12: 6, # µg
    vitamin_a_iu: 5000, # IU
    vitamin_e_alpha_tocopherol: 30, # IU
    vitamin_d: 400, # IU
    vitamin_k: 80, # µg
    cholesterol: 300, # mg
  }

  def page_title
    combo = "#{t :title} | #{t :subtitle}"
    @title.present? ? "#{@title} | #{combo}" : combo
  end

  def atom_feed_link(title, url)
    tag 'link', rel: 'alternate',
                type: 'application/atom+xml',
                href: url,
                title: title
  end

  def short_info(rubygem)
    info = gem_info(rubygem).strip.truncate(90)
    escape_once(sanitize(info))
  end

  def gem_info(rubygem)
    if rubygem.respond_to?(:description)
      [rubygem.description, rubygem.summary, 'This rubygem does not have a description or summary.'].find(&:present?)
    else
      version = rubygem.latest_version || rubygem.versions.last
      version.info
    end
  end

  def gravatar(size, id = 'gravatar', user = current_user)
    image_tag(user.gravatar_url(size: size, secure: request.ssl?).html_safe, id: id, width: size, height: size)
  end

  def download_count(rubygem)
    number_with_delimiter(rubygem.downloads)
  end

  def stats_graph_meter(gem, count)
    gem.downloads * 1.0 / count * 100
  end

  def daily_percentage(nutrient, value)
    DAILY_PECENTAGES[nutrient].nil? ? '-' : "#{((value / DAILY_PECENTAGES[nutrient]) * 100).round(2)} %"
  end
end
