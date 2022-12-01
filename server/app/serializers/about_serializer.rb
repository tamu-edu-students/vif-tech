class AboutSerializer < ActiveModel::Serializer
  # has_many :social_links

  attributes :id, :firstname, :lastname, :imgSrc, :role, :description, :rank, :social_links

  def social_links
    ActiveModel::SerializableResource.new(object.social_links, each_serializer: SocialLinkSerializer)
  end
end
